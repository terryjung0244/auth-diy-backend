import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "../route/auth";

const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/auth", authRoutes);

  return app;
};

export default createServer;
