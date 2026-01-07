import express from "express";
import inicio from "./rutas/inicio.js";
import { sequelize } from "./db.js";
import "./modelos/models.js";

const app = express();

// 🔑 PUERTO DINÁMICO (Render)
const PORT = process.env.PORT || 3000;

app.use(express.json());

 //CORS (ok)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// rutas
app.use("/", inicio);
const startServer = async () => {
  try {
    // ⚠️ NO usar force:true en producción
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Server corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();
