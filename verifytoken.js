import 'dotenv/config'; // or import dotenv and call dotenv.config()
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error("❌ JWT_SECRET not set in environment");
  process.exit(1);
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODljNzkwMQ";

try {
  const payload = jwt.verify(token, SECRET);
  console.log(payload);
} catch (err) {
  console.error("Token invalid:", err);
}