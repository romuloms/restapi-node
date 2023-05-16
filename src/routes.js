// definindo todos os endpoints seguindo os padrões de nomenclatura do REST

const UserController = require('./controllers/UserController')

module.exports = [
    {
        endpoint: '/users',
        method: 'GET',
        handler: UserController.listUsers,
    },
    {
        endpoint: '/users/:id',
        method: 'GET',
        handler: UserController.getUserById,
    },
    {
        endpoint: '/users',
        method: 'POST',     // apenas no POST e PUT se recebe body
        handler: UserController.createUser,
    },
    {
        endpoint: '/users/:id',
        method: 'PUT',
        handler: UserController.updateUser,
    },
    {
        endpoint: '/users/:id',
        method: 'DELETE',
        handler: UserController.deleteUser,
    },
];

