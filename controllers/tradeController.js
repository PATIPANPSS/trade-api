const db = require("../config/db");

const createTrade = async (req, res) => {
  try {
    const { symbol, entry_price, pattern } = req.body;
    const user_id = req.user.userId;

    if (!symbol || !entry_price || entry_price <= 0 || !pattern) {
      return res
        .status(400)
        .json({ message: "โปรดระบุข้อมูลให้ครบถ้วน และราคาต้องมากกว่า 0" });
    }

    const sql =
      "INSERT INTO watchlist (symbol, entry_price, pattern, user_id) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      symbol,
      entry_price,
      pattern,
      user_id,
    ]);

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
    const user_id = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countSql =
      "SELECT COUNT(*) as totalItems FROM watchlist WHERE user_id = ?";
    const [countRows] = await db.query(countSql, [user_id]);
    const totalItems = countRows[0].totalItems;

    const sql =
      "SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const [result] = await db.query(sql, [user_id, limit, offset]);

    return res.status(200).json({
      success: true,
      data: result,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const getById = async (req, res) => {
  try {
    const tradeId = req.params.id;
    const user_id = req.user.userId;

    const sql = "SELECT * FROM watchlist WHERE id = ? AND user_id = ?";
    const [result] = await db.query(sql, [tradeId, user_id]);

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
    const user_id = req.user.userId;
    const { symbol, entry_price, pattern } = req.body;

    if (!symbol || !entry_price || entry_price <= 0 || !pattern) {
      return res
        .status(400)
        .json({ message: "โปรดระบุข้อมูลให้ครบถ้วน และราคาต้องมากกว่า 0" });
    }

    const sql =
      "UPDATE watchlist SET symbol = ?, entry_price = ?, pattern = ? WHERE id = ? AND user_id = ?";
    const [result] = await db.query(sql, [
      symbol,
      entry_price,
      pattern,
      tradeId,
      user_id,
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

const deleteTrade = async (req, res) => {
  try {
    const tradeId = req.params.id;
    const user_id = req.user.userId;

    const sql = "DELETE FROM watchlist WHERE id = ? AND user_id = ?";
    const [result] = await db.query(sql, [tradeId, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบแผนการเทรดนี้" });
    }

    return res.status(200).json({ message: "ลบสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const sql =
      "SELECT COUNT(*) AS total_trades, SUM(entry_price) AS total_investment FROM watchlist WHERE user_id = ?";
    const [result] = await db.query(sql, [user_id]);

    const totalTrades = result[0].total_trades;
    const totalInvestment = result[0].total_investment || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalTraeds: totalTrades,
        totalInvestment: totalInvestment,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

module.exports = {
  createTrade,
  getAllTrades,
  getById,
  updateTrade,
  deleteTrade,
  getDashboardSummary
};
