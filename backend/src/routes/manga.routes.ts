import { Router } from "express";
import { pesquisarManga } from "../controllers/manga.controller";

const router = Router();

router.post("/coletar", pesquisarManga);

export default router;