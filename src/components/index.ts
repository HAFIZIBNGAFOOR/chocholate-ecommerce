import express from "express";
import components from "./components";

export const registerComponents = (app: express.Application) => {
  app.use("/api", components);
};
