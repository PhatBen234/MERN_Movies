// index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./source/routes/index.js";

const app = express();

// Cấu hình CORS cho phép tất cả các nguồn
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Định nghĩa các route chính
app.use("/api/v1", routes);

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Khởi tạo server và kết nối MongoDB
const port = process.env.PORT || 8080;
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb Connected");
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

export default app;
