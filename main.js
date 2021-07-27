const dotenv = require('dotenv')
dotenv.config({path: './.env.local'})

const {createPopulationSchedules} = require('./ingest')


async function createSchdule() {
    const databaseName  = "ItgSampleDataPop"
    const tableName = "Equipment0"
    const cronExpression = "*/1 * * * *"
    const schemaType = "Equipment"
    const itgProjectId = "a9f70583f-fe10-4a93-b42e-09c6c9ded724"
    const jsonataTransform = undefined
    const baseUrl = "https://itg.cognite.ai"
    const customerApiKey = process.env.CUSTOMER_API_KEY
    const tenant = process.env.TENANT
    
    await createPopulationSchedules(
        databaseName,
        tableName,
        cronExpression,
        schemaType, 
        itgProjectId,
        jsonataTransform, 
        baseUrl,
        customerApiKey,
        tenant
    )
}

createSchdule()
