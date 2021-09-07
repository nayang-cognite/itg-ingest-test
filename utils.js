const winston = require('winston');
const moment = require('moment'); // require


function initLogger (label, logLevel) {
    return winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
            winston.format.label({ label }),
            winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
            winston.format.printf(
              (info) =>
                `${[info.timestamp]}:${info.label}:${info.level} ${info.message}`
            )
         ),      
        transports: [new winston.transports.Console({})],
    })      
}

function convertEpoch2Local(epoch) {
    return moment.utc(epoch).local().format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
    initLogger,
    convertEpoch2Local
}