const db = require("../config/db");

const createTrade = async (req, res) => {
  try {
    const { symbol, entry_price, pattern } = req.body;
    const sql =
      "INSERT INTO watchlist (symbol, entry_price, pattern) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [symbol, entry_price, pattern]);

    return res.status(201).json({
      message: "เพิ่มแผนการเทรดสำเร็จ",
      tradeId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const getAllTrades = async (req, res) => {
  try {
    const sql = "SELECT * FROM watchlist ORDER BY created_at DESC";
    const [result] = await db.query(sql);

    return res
      .status(200)
      .json({ success: true, data: result, total: result.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const getById = async (req, res) => {
  try {
    const tradeId = req.params.id;
    const sql = "SELECT * FROM watchlist WHERE id = ?";
    const [result] = await db.query(sql, [tradeId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบแผนการเทรดนี้" });
    }

    return res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const updateTrade = async (req, res) => {
  try {
    const tradeId = req.params.id;
    const { symbol, entry_price, pattern } = req.body;
    const sql =
      "UPDATE watchlist SET symbol = ?, entry_price = ?, pattern = ? WHERE id = ?";
    const [result] = await db.query(sql, [
      symbol,
      entry_price,
      pattern,
      tradeId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบแผนการเทรดนี้" });
    }

    return res.status(200).json({ message: "แก้ไขสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const deleteTrade = async(req, res) => {
    try{
        const tradeId = req.params.id;
        const sql = 'DELETE FROM watchlist WHERE id = ?';
        const [result] = await db.query(sql, [tradeId]);

        if(result.affectedRows === 0){
            return res.status(404).json({ message: 'ไม่พบแผนการเทรดนี้'});
        }

        return res.status(200).json({ message: 'ลบสำเร็จ'});
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database"})
    }
}

module.exports = {
  createTrade,
  getAllTrades,
  getById,
  updateTrade,
  deleteTrade
};
