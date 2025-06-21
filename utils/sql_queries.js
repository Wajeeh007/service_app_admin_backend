const selectLastInsertId = `SELECT LAST_INSERT_ID() AS id`
const selectFromZone = `SELECT id, name, \`desc\`, status, order_vol, polylines FROM zones WHERE id = ?`
const getZones = `SELECT id, name, \`desc\`, status, polylines FROM zones ORDER BY id ASC LIMIT ? OFFSET ?`
const addNewZone = `INSERT INTO zones (name, \`desc\`, polylines) VALUES (?, ?, ST_GeomFromText(?, 4326))`
const addNewService = `INSERT INTO service (name, \`desc\`, image) VALUES (?, ?, ?)`

module.exports = {
    selectLastInsertId,
    selectFromZone,
    getZones,
    addNewZone,
    addNewService
}