import express from "express";

import routeGetLessons from "./controllers/getLessons.js";

const router = express.Router();

router.get("/lessons", routeGetLessons);

export default router;
