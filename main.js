const BootcampManager = require('./lib');
const appConfig = require('./configs/app.config.json');

var application = new BootcampManager(appConfig);

application.start();
