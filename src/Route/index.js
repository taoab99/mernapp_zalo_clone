const siteRoute = require('./Site');
const CreateUser = require('./userout');
const MessageRoute = require('./MessageRoute');
const ConverstationRoute = require('./conversation');

function route(app) {
    app.use('/conversation', ConverstationRoute);
    app.use('/message', MessageRoute);
    app.use('/user', CreateUser);
    app.use('/', siteRoute);

}

module.exports = route;