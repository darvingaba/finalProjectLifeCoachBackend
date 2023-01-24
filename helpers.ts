import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

export function hashed(password: string) {
  const hashed = bcrypt.hashSync(password, 10);
  return hashed;
}

export function verify(password: string, hash: string) {
  const verified = bcrypt.compareSync(password, hash);
  return verified;
}

export function getToken(id: number) {
  return jwt.sign({ id }, process.env.KEY!);
}

export async function currentUser(token: string) {
  try {
    const verify = jwt.verify(token, process.env.KEY!);
    //@ts-ignore
    const user = await prisma.user.findUnique({
      where: { id: (verify as any).id },
    });
    return user;
  } catch (error) {
    return null
  }
}
