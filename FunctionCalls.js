const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config({ path: './.env.local' })

const { initLogger } = require('./utils')
const logger = initLogger("calls", process.env.LOG_LEVEL)

async function listFunctionCalls(
    functionId
) {
    const url = `${process.env.POPULATION_FUNCTION_API_URL}/${functionId}/calls`;
    logger.debug(`url=${url}`)
    const headers = {
        'api-key': "M2U1YWZhNjAtOTk2NS00ZTRhLWI0NWEtZmQ0NDIzYmZlZDBh",
        'Content-Type': 'application/json',
    }

    const data = {
        "limit": 10
    };

    logger.debug(`${JSON.stringify(headers)}`)
    await axios.get("https://api.cognitedata.com/api/playground/projects/itg-testing/functions/schedules", data, { headers: headers })
        .then((response) => {
            logger.info(response.data);
        })
        .catch((error) => {
            logger.error("debug")
            logger.error(JSON.stringify(error.response.data));
        })
}

module.exports = {
    listFunctionCalls
}