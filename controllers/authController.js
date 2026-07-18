const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const [result] = await db.query(sql, [username, hashedPassword]);

    return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    const [result] = await db.query(sql, [username]);

    const user = result[0];
    if (!user) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { username, old_password, new_password } = req.body;

    if (!username || !old_password || !new_password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sqlSelect = "SELECT * FROM users WHERE username = ?";
    const [users] = await db.query(sqlSelect, [username]);

    const user = users[0];
    if (!user) {
      return res.status(404).json({ message: "ไม่พบ username" });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const sqlUpdate = "UPDATE users SET password = ? WHERE username = ?";
    const [result] = await db.query(sqlUpdate, [hashedPassword, username]);

    return res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Database" });
  }
};

module.exports = {
  register,
  login,
};
