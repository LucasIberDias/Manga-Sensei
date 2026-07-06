import app from "./app";

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});