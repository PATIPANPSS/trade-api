const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "patipan110544",
  database: "trade_watchlist",
  connectionLimit: 10,
});

(async() => {
    try{
        const connection = await pool.getConnection();
        console.log("Database Connected Successfully!");
        connection.release();
    }catch(error){
        console.log("Database Connection Failed: ", error.message);
    }
})();

module.exports = pool;
