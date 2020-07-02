const express = require('express');
const db = require('./models');
const response = require('./middlewares/response');
const checkJtw = require('./middlewares/jwt');

const authController = require('./controllers/auth');
const linkController = require('./controllers/link');

const app = express();

app.use(response);
app.use(checkJtw);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authController);
app.use('/link', linkController);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Rodando na porta 3001');
    });
});

