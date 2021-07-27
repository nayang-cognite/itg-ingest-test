const axios = require( 'axios')
const dotenv = require('dotenv')
dotenv.config({path: './.env.local'})


async function createPopulationSchedules(
    databaseName,
    tableName,
    cronExpression,
    schemaType,
    itgProjectId,
    jsonataTransform,
    baseUrl,
    customerApiKey,
    tenant
) {
    const createScheduleData = {
      schemaType,
      rawDb: databaseName,
      rawTable: tableName,
      itgProjectId,
      jsonataTransform,
      baseUrl,
      customerApiKey,
      tenant,
    };

    const url = `${process.env.POPULATION_FUNCTION_API_URL}/schedules`;
    const headers = {
        'api-key': process.env.CUSTOMER_API_KEY_COGNITE,
        'Content-Type': 'application/json',
      }
    const data = {
      items: [
        {
          name: `${itgProjectId}-${schemaType}`,
          cronExpression,
          functionExternalId: process.env.POPULATION_FUNCTION_EXTERNAL_ID,
          data: createScheduleData,
        },
      ],
    };
    await axios.post(url, data, {headers: headers})
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error.response.data);        
    })
}

module.exports = {
    createPopulationSchedules
}