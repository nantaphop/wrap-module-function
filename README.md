# wrap-module-function
Helper for override `module.exports` to do something like middleware or wrap all exported function from all modules in specific path.

For example, logging excutation time for all modules in `./domains/...` directory or logging all function call on every function exported from module in `./utils/...`
# Installation
```
    npm install --save wrap-module-function
```
# Configuration
Please see more detail example on `./example`
```javascript
const wrapModule = require('wrap-module-function')
// Must be call this before any require module
wrapModule({
        debug: false
    }, {
        // Key is something in path of target module. In this case will match every file in controller directory
        'controller': function(exports, named, fullFilePath){
            return function(){
                // Log everytime controller function called
                console.log(`--- controller ${named} involed`)
                return exports.apply(this, arguments)
            }
        },
        // Match every module in domain directiory
        'domain': function(exports, named, fullFilePath){
            return function(){
                // Log excution time
                const start = Date.now()
                const result = exports.apply(this, arguments)
                console.info(`--- ${named} excuted in ${Date.now()-start}ms`)
                return result
            }
        } 
    }
)
```
# How it work
Override `Module._load` based on approach of https://github.com/boblauer/mock-require 
