import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// PostgreSQL に接続するためのコネクションプールとアダプターを用意するぞ
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  console.log("データベースに接続中...");
  
  // ユーザーを 1 件追加してみるぞ
  const newUser = await prisma.user.create({
    data: { name: `新しいユーザー ${new Date().toISOString()}` },
  });
  console.log("追加されたユーザー:", newUser);

  // 全ユーザーの一覧を取得するぞ
  const users = await prisma.user.findMany();
  console.log("現在のユーザー一覧:", users);
}

main()
  .catch((e) => { 
    console.error("エラーが発生したぞ:", e); 
    process.exit(1); 
  })
  .finally(() => {
    // prisma と pool の両方を閉じないとプログラムが終わらないので注意じゃ
    return Promise.all([prisma.$disconnect(), pool.end()]);
  });