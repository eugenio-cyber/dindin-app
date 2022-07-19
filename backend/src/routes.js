const express = require('express');

const users = require('./controllers/users');
const transactions = require('./controllers/transactions');
const login = require('./controllers/login');
const category = require('./controllers/category');
const verifyLogin = require('./filters/verifyLogin');

const routes = express();

routes.post('/usuario', users.registerUser);

routes.post('/login', login.login);


routes.use(verifyLogin);

routes.get('/usuario', users.detailUser);
routes.put('/usuario', users.updateUser);

routes.get('/categoria', category.listCategories);

routes.get('/transacao', transactions.readTransactions);
routes.get('/transacao/extrato', transactions.resumeTransactions);
routes.get('/transacao/:id', transactions.findTransaction);
routes.post('/transacao', transactions.createTransaction);
routes.put('/transacao/:id', transactions.updateTransaction);
routes.delete('/transacao/:id', transactions.deleteTransaction);

module.exports = routes;