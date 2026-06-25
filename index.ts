import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// DB 接続の準備
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

// EJS を使う設定
app.set("view engine", "ejs");
app.set("views", "./views");
// フォームからの入力を受け取れるようにする
app.use(express.urlencoded({ extended: true }));

// トップページ：ユーザー一覧を表示する
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

// ユーザー追加
app.post("/users", async (req, res) => {
  const { name, age } = req.body;
  
  if (name) {
    await prisma.user.create({ 
      data: { 
        name, 
        age: age ? Number(age) : null 
      } 
    });
    console.log("追加成功じゃ！:", { name, age });
  }
  res.redirect("/");
});

// ★ここじゃ！この 3 行が抜けておったので、サーバーが起動しなかったのじゃな
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});