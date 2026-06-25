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

// EJS を使う設定じゃ
app.set("view engine", "ejs");
app.set("views", "./views");
// フォームからの入力を受け取れるようにするぞ
app.use(express.urlencoded({ extended: true }));

// トップページ：ユーザー一覧を表示する
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

// ユーザー追加：フォームから送られた名前を保存する
app.post("/users", async (req, res) => {
  const name = req.body.name;
  if (name) {
    const newUser = await prisma.user.create({ data: { name } });
    console.log("新しく追加したぞ:", newUser);
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});