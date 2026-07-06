import { Router } from "express";
import { pesquisarManga } from "../controllers/mangaController";

const router = Router();

router.get("/mangas", pesquisarManga);

export default router;