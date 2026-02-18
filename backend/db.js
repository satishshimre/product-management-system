const oracledb = require("oracledb");
require("dotenv").config();

// Return rows as JSON objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT
    });

    console.log("✅ Oracle DB Connected");
    return connection;

  } catch (error) {
    console.error("❌ Oracle DB Connection Failed");
    console.error(error.message);
    throw error;
  }
}

module.exports = { getConnection };
