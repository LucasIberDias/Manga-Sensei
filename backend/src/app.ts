import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import mangaRoutes from "./routes/manga.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend do Mangá Sensei funcionando!"
    });
});

app.use("/auth", authRoutes);
app.use("/", mangaRoutes);

export default app;