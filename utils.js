const winston = require('winston');

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

module.exports = {
    initLogger_
}