const cassandra = require("cassandra-driver")

module.exports = new cassandra.Client({
  contactPoints: [process.env.DB_HOST],
  localDataCenter: process.env.DATA_CENTER,
  keyspace: process.env.KEYSPACE
})
