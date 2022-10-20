import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { currentUser, getToken, hashed, verify } from "./helpers";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
const port = 3456;

app.post("/sign-up", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
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
          name: req.body.name,
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

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { workouts: true } });
  res.send(users);
});

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

app.get("/validate", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const user = await currentUser(token);
    if (user) {
      const newToken = getToken(user.id);
      res.send({ user, token: newToken });
    } else {
      res.status(404).send({ errors: ["Token invalid"] });
    }
  } else {
    res.status(404).send({ errors: ["Token not provided"] });
  }
});

app.get("/workouts", async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({ include: { user: true } });
    res.send(workouts);
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: error.message });
  }
});

app.get("/workout/:id", async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send(workout);
});
app.get("/workoutsDone", async (req, res) => {
  const doneW = await prisma.workout.findMany({ where: { completed: true } });
  res.send(doneW);
});
app.patch("/workout/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    // const userId = req.body.userId;
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        completed: true,
        whenWasCompleted: Date(),
      },
    });
    res.send(updatedWorkout);
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ erro: error.message });
  }
});

app.get("/trainers", async (req, res) => {
  const trainers = await prisma.trainers.findMany({
    include: { clients: true },
  });

  res.send(trainers);
});

app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const trainersId = req.body.trainersId;
  const booked = await prisma.user.update({
    where: {
      id,
    },
    data: {
      trainersId,
    },
  });
  res.send(booked);
});

app.patch("/usersnew/:id", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const updatedProfile = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        email,
        password: bcrypt.hashSync(password),
      },
    });
    res.send(updatedProfile);
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: error.message });
  }
});
app.get("/subscriptions", async (req, res) => {
  
  const subscriptions = await prisma.subscription.findMany();
  res.send(subscriptions);
});
app.get("/subscriptionDone", async (req, res) => {
  const subscriptions = await prisma.subscription.findFirst({where:{booked:true}});
  res.send(subscriptions)
});
app.get("/subscriptions/:id", async (req, res) => {
  const id = Number(req.params.id);
  const subscriptions = await prisma.subscription.findUnique({where:{id}});
  res.send(subscriptions)
});

app.patch("/subscriptions/:id", async (req, res) => {
  const updated = await prisma.subscription.update({
    where: { id:Number(req.params.id) },
    data: { booked: true },
  });
  res.send(updated)
});
app.listen(port, () => {
  console.log("server up")
});
