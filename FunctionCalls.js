const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config({ path: './.env.local' })

const { initLogger, convertEpoch2Local } = require('./utils')
const logger = initLogger("calls", process.env.LOG_LEVEL)

async function listFunctionCallsOneBatch(apiKey, functionId, cursor) {
    let result
    const url = `${process.env.POPULATION_FUNCTION_API_URL}/${functionId}/calls`;
    const headers = {
        'api-key': apiKey,
        'Content-Type': 'application/json',
    }
    const data = {
        cursor: cursor
    };
    logger.info(url)
    await axios(
        {
            method: 'get',
            url,
            data,
            headers
        }
    ).then((response) => {        
        const {items, nextCursor} = response.data
        logger.info(`cursor=${cursor}`);
        items.forEach(item => {
            const scheduledTime = convertEpoch2Local(item.scheduledTime)
            const startTime = convertEpoch2Local(item.startTime)
            const endTime = convertEpoch2Local(item.endTime)
            logger.info(`id=${item['id']} scheduleId=${item['scheduleId']} scheduledTime=${scheduledTime} startTime=${startTime} endTime=${endTime} ${item['status']}`) 
        });
        result = nextCursor
        logger.info(`nextCursor=${nextCursor}`)
    }).catch((error) => {
        console.log(error);
    })
    return result
}

async function listFunctionCalls(
    functionId
) {
    const apiKey = "M2U1YWZhNjAtOTk2NS00ZTRhLWI0NWEtZmQ0NDIzYmZlZDBh"
    let cursor = undefined
    while (true) {
        nextCursor = await listFunctionCallsOneBatch(apiKey, functionId, cursor)
        if (nextCursor===cursor) {
            break
        }
        cursor = nextCursor
    }
}

module.exports = {
    listFunctionCalls
}