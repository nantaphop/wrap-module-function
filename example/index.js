const wrapModule = require('..')
wrapModule({
        debug: false
    }, {
        'controller': function(exports, named, fullFilePath){
            return function(){
                console.log(`--- controller ${named} involed`)
                return exports.apply(this, arguments)
            }
        },
        'domain': function(exports, named, fullFilePath){
            return function(){
                const start = Date.now()
                const result = exports.apply(this, arguments)
                console.info(`--- ${named} excuted in ${Date.now()-start}ms`)
                return result
            }
        } 
    }
)

const controller = require('./controllers/users')
controller.create()
controller.delete()
controller.delete()
controller.delete()
controller.delete()