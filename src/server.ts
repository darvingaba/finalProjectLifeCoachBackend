import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { currentUser, getToken, hashed, verify } from "./helpers";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
const port = 3456;

app.post("/sign-up", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name
    const realUser = await prisma.user.findUnique({ where: { email } });

    const errors: string[] = [];

    if (typeof email !== "string") {
      errors.push("Email missing or not a string!");
    }
    if (typeof password !== "string") {
      errors.push("Password missing or not a string!");
    }
    if (typeof name !== "string") {
      errors.push("Name missing or not a string!");
    }
    if (errors.length > 0) {
      return res.status(404).send({ errors });
    }

    if (!realUser) {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashed(password),
          name:req.body.name
        },
      });
      const token = getToken(user.id);
      res.send({ user, token });
    } else {
      res.status(404).send({ errors: ["Email already exists"] });
    }
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: [error.message] });
  }
});

app.get("/users",async(req,res)=>{
  const users = await prisma.user.findMany()
  res.send(users)
})

app.post("/sign-in", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const errors: string[] = [];

    if (typeof email !== "string") {
      errors.push("Email missing or not a string!");
    }
    if (typeof password !== "string") {
      errors.push("Password missing or not a string!");
    }

    if (errors.length > 0) {
      return res.status(404).send({ errors });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user && verify(password, user.password)) {
      const token = getToken(user.id);
      res.send({ user, token });
    } else {
      res.status(404).send({ errors: ["Username/password invalid"] });
    }
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ errors });
  }
});

app.get("/validate",async(req,res)=>{
  const token = req.headers.authorization
  if (token) {
    const user = await currentUser(token);
    if (user) {
      const newToken = getToken(user.id);
      res.send({ user, token: newToken });
    }else{
      res.status(404).send({errors:["Token invalid"]})
    }
  } else {
    res.status(404).send({ errors: ["Token not provided"] });
  }
})

app.listen(port, () => {
  console.log("server up");
});
