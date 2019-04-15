const Module = require('module')
const normalize = require('normalize-path');
const dirname = require('path').dirname;
const join = require('path').join;
const resolve = require('path').resolve;
const pathsep = require('path').sep;const originalLoad = Module._load

module.exports = function ({debug = false}, wrapingRules){
    Module._load = function (request, parent) {
        const fullFilePath = getFullPathNormalized(request, parent.filename);
        debug && console.info('wrapping', fullFilePath)
        const exports = originalLoad.apply(this, arguments)
        const wrappedExports = Object.keys(wrapingRules)
            .filter(path => fullFilePath.includes(path))
            .map(p => (debug && console.info('wrapingRules', p)) || p)
            .reduce((originalExports, rule) => {
                debug && console.info('originalExports', rule, originalExports)
                const name = fullFilePath.substr(fullFilePath.indexOf(rule), fullFilePath.length)
                if(typeof originalExports === 'object'){
                    for(named in originalExports){
                        if(typeof originalExports[named] === 'function'){
                            originalExports[named] = wrapingRules[rule](originalExports[named], name, fullFilePath)
                        }
                    }
                }else if(typeof originalExports === 'function'){
                    originalExports = wrapingRules[rule](originalExports, name, fullFilePath)
                }
                return originalExports
            }, exports)
        return wrappedExports
    };
}

function isInNodePath(resolvedPath) {
    if (!resolvedPath) return false;
  
    return Module.globalPaths
      .map((nodePath) => {
        return resolve(process.cwd(), nodePath) + pathsep;
      })
      .some((fullNodePath) => {
        return resolvedPath.indexOf(fullNodePath) === 0;
      });
  }

function getFullPath(path, calledFrom) {
    let resolvedPath;
    try {
        resolvedPath = require.resolve(path);
    } catch (e) {
        // do nothing
    }

    const isLocalModule = /^\.{1,2}[/\\]?/.test(path);
    const isInPath = isInNodePath(resolvedPath);
    const isExternal = !isLocalModule && /[/\\]node_modules[/\\]/.test(resolvedPath);
    const isSystemModule = resolvedPath === path;

    if (isExternal || isSystemModule || isInPath) {
        return resolvedPath;
    }

    if (!isLocalModule) {
        return path;
    }

    const localModuleName = join(dirname(calledFrom), path);
    try {
        return Module._resolveFilename(localModuleName);
    } catch (e) {
        if (isModuleNotFoundError(e)) { return localModuleName; } else { throw e; }
    }
}
  
function getFullPathNormalized(path, calledFrom) {
    return normalize(getFullPath(path, calledFrom));
}