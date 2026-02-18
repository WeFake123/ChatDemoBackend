import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

console.log("DATABASE_URL =>", process.env.DATABASE_URL);

import express from "express";

import inicio from "./rutas/inicio.js";
import  sequelize  from "./db.js";
import "./modelos/models.js";
import http from "http";
import { Server } from "socket.io";


const app = express();




const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-demo-ashy-pi.vercel.app",
      "https://chat-demo-lduq1za90-augustos-projects-baeb41e6.vercel.app"
    ],
    methods: ["GET", "POST"]
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



// 🌍 CORS
app.use(cors({
  origin: [
    "https://chat-demo-ashy-pi.vercel.app",
    "https://chat-demo-lduq1za90-augustos-projects-baeb41e6.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

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
