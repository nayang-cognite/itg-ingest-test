const dotenv = require('dotenv')
dotenv.config({ path: './.env.local' })

const { createPopulationSchedules } = require('./ingest')
const { readRaw } = require('./cdf')
const { listFunctionCalls } = require('./FunctionCalls')

const ThreedTransform = ` { 
    "id": id, 
    "name": name, 
    "properties_item_required": Properties\\Item\\Required, 
    "properties_item_material": Properties\\Item\\Material,
    "properties_type": Properties\\Item\\Type,
    "properties_item_icon": Properties\\Item\\Icon,
    "properties_item_hidden": Properties\\Item\\Hidden,
    "bounding_box_max_x": bounding_box_max_x ? $number(bounding_box_max_x) : "",
    "bounding_box_max_y": bounding_box_max_y ? $number(bounding_box_max_y) : "",
    "bounding_box_max_z": bounding_box_max_z ? $number(bounding_box_max_z) : "",
    "bounding_box_min_x": bounding_box_min_x ? $number(bounding_box_min_x) : "",
    "bounding_box_min_y": bounding_box_min_y ? $number(bounding_box_min_y) : "",
    "bounding_box_min_z": bounding_box_min_z ? $number(bounding_box_min_z) : "",                
    "depth": depth ? $number(depth) : "",
    "subtree_size": subtree_size ? $number(subtree_size) : "",
    "parent_id": parent_id
  }
  `

async function createSchdule(data) {
    const baseUrl = "https://itg.cognite.ai"
    const customerApiKey = process.env.CUSTOMER_API_KEY
    const tenant = process.env.TENANT

    const { databaseName, tableName, cronExpression } = data
    const { schemaType, itgProjectId, jsonataTransform } = data

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

async function readRawData() {
    const rawDb = "ItgSampleDataPop"
    const rawTable = "Area"
    // https://docs.cognite.com/api/v1/#operation/deleteTables 
    // Note that the 'minLastUpdatedTime' and the 'maxLastUpdatedTime' query parameter on Read Rows are ignored when a cursor is specified.
    const rawApiOptions = {
        minLastUpdatedTime: 1627495502979,
        limit: 10000
    }
    readRaw(rawDb, rawTable, rawApiOptions)
}

const databaseName = "threed2"
const tableName = "threed.7908259153294755.3779290245691444"
const cronExpression = "10 */2 * * *"
const schemaType = "Model"
const itgProjectId = "aecca9bb4-a91a-478b-a72a-392d8fc08208"
const jsonataTransform = ThreedTransform
const baseUrl = "https://itg.cognite.ai"

const threeDScheduleData = {
    databaseName: "threed2",
    tableName: "threed.7908259153294755.3779290245691444",
    cronExpression: "*/20 * * * *",
    schemaType: "Model",
    itgProjectName: "nancy-3",
    itgProjectId: "a04c96a53-642c-4e30-8133-76cf5f000256",
    jsonataTransform: ThreedTransform
}

const areaScheduleData = {
    databaseName: "ItgSampleDataPop",
    tableName: "Area",
    cronExpression: "*/5 * * * *",
    schemaType: "Area",
    itgProjectName: "",
    itgProjectId: "a04c96a53-642c-4e30-8133-76cf5f000256",

    jsonataTransform: undefined
}

// createSchdule(threeDScheduleData)
listFunctionCalls(6429432455268604)