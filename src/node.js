import express from "express";
import inicio from "./rutas/inicio.js";
import { sequelize } from "./db.js";
import "./modelos/models.js";

import http from "http";
import { Server } from "socket.io";


const app = express();


const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    // Enviar mensaje a todos los clientes
    io.emit("mensaje", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// 🔑 PUERTO DINÁMICO (Render)
const PORT = process.env.PORT || 3000;

// middleware base
app.use(express.json());

// 📂 Servir imágenes subidas
app.use("/uploads", express.static("uploads"));

// 🌍 CORS
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
    await sequelize.sync(); // ⚠️ solo desarrollo

    server.listen(PORT, () => {
      console.log(`🚀 Server corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();
