import { Router } from "express";
import { pesquisarManga, explorarMangas } from "../controllers/mangaController";

const router = Router();

router.get("/manga", pesquisarManga);
router.get("/explorar", explorarMangas);
router.post("/pesquisarManga", pesquisarManga);

export default router;