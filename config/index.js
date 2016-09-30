var configValues = require('./config');

module.exports = {
    getDbConnectionConfig: function () {
        var connection = 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@ds033046.mlab.com:33046/eccomm';
        console.log(connection);
        return connection;
    },
    secretKey: "secret"
}
