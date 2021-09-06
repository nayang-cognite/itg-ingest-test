const { CogniteClient } = require('@cognite/sdk');
const dotenv = require('dotenv')
dotenv.config({path: './.env.local'})

FUNCTION_NAME = 'itg-ingest-test'

const {initLogger} = require('./utils')
const logger = initLogger("cdf", process.env.LOG_LEVEL)

const printCdfRow = (obj, rowKey) => {
    Object.keys(obj).forEach((key) => {
        if (key === "columns") {
            printCdfRow(obj[key], rowKey);
        } else if (key==="lastUpdatedTime") {
            logger.info(`,${rowKey}, lastUpdatedTime, ${new Date(obj[key]).getTime()}, ${obj[key]}`);
        } else if (key==="key") {
            rowKey = obj[key]
            logger.info(`Key ${rowKey}`);
        } else {
            logger.info(`${rowKey} Column          ${key}=${obj[key]}`);
        }

    });        
}

async function readRaw(rawDb, rawTable, rawApiOptions, printRow) {
    client = new CogniteClient({ appId: FUNCTION_NAME });
    client.loginWithApiKey({ project: process.env.TENANT, apiKey: process.env.CUSTOMER_API_KEY });
    logger.info(`Read data from ${process.env.TENANT} ${rawDb} ${rawTable}`)
    let totalNumRows = 0
    while (true) {        
        const rawRowResponse = await client.raw.listRows(rawDb, rawTable, rawApiOptions);                        
        const numRows = rawRowResponse.items.length
        totalNumRows += numRows
        logger.info(`rawApiOptions ${JSON.stringify(rawApiOptions)} Number of rows read ${numRows}`)
        if (printRow) {
            rawRowResponse.items.forEach(row => printCdfRow(row, ""))
        }        
        if (rawRowResponse.nextCursor===undefined) {
            break
        }
        // logger.info(`nextCursor=${rawRowResponse.nextCursor}`)    
        rawApiOptions = {
            ...rawApiOptions,
            cursor : rawRowResponse.nextCursor
        }
        break
    }
    logger.info(`Total number of rows read ${totalNumRows}`)
}

module.exports = {
    readRaw
}