const express = require('express');
const db = require('./models');
const response = require('./middlewares/response');

const authController = require('./controllers/auth');

const app = express();

app.use(response);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authController);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Rodando na porta 3001');
    });
});

