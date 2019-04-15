const createUser = require('../domains/users/createUser')
const deleteUser = require('../domains/users/deleteUser')
module.exports = {
    create: () => {
        console.log('try to create user')
        createUser()
    },
    delete: () => {
        console.log('try to delete user')
        deleteUser()
    },
}
module.exports.test = '2222'