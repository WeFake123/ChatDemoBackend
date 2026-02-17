import { Text } from "../modelos/models.js";
import { Chat } from "../modelos/models.js";
import { Op } from "sequelize";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { io } from "../node.js";

export const getText = async (req, res) => {
  try {
    const textos = await Text.findAll();
    res.json(textos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener textos" });
  }
};


export const postText = async (req, res) => {
  let filePath = null;

  try {
    const { name, text } = req.body;
    const image = req.file;
    const ip = req.ip;

    // 🔹 Validar campos primero
    if (!name || !text || !image) {
      if (image) fs.unlinkSync(image.path);
      return res.status(400).json({ message: "Campos incompletos" });
    }

    filePath = image.path;

    // 🔹 Validación REAL del archivo
    const buffer = await fs.promises.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    const allowedMime = ["image/jpeg", "image/png", "image/webp"];

    if (!type || !allowedMime.includes(type.mime)) {
      await fs.promises.unlink(filePath);
      return res.status(400).json({ error: "Archivo inválido" });
    }

    // 🔹 Cooldown por IP (5 minutos)
    const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

    const ultimoPost = await Text.findOne({
      where: {
        ip,
        createdAt: {
          [Op.gt]: cincoMinutosAtras
        }
      }
    });

    if (ultimoPost) {
      await fs.promises.unlink(filePath);
      return res.status(429).json({
        message: "Esperá 5 minutos antes de volver a postear"
      });
    }

    // 🔹 Crear post
    const nuevoTexto = await Text.create({
      name,
      text,
      image: image.filename,
      ip
    });

    io.emit("nuevo_post", nuevoTexto);

    res.json(nuevoTexto);

  } catch (error) {
    console.error(error);

    // 🔥 Si algo falla → borrar imagen
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    res.status(500).json({ error: "Error al crear el post" });
  }
};

export const getTextId = async (req, res) => {
  const { id } = req.params;
  console.log("Controller getChat", req.params.id);

  try {
    const textos = await Text.findAll({
      where: { id: id }
    });
    res.json(textos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Chats" });
  }
};


//----------------------------------------------------------

export const getChat = async (req, res) => {
  console.log(req.params)
      const { id } = req.params;

  try {

    const textos = await Chat.findAll({
      where: {
        idPost: id
      }
    });
    res.json(textos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Chats" });
  }
};




export const postChat = async (req, res) => {
  let filePath = null;

  try {
    const { data, idPost, serial, replyTo } = req.body;
    const image = req.file;

    // 🔹 Validar texto obligatorio
    if (!data || !idPost || !serial) {
      if (image) fs.unlinkSync(image.path);
      return res.status(400).json({ message: "Campos incompletos" });
    }

    // 🔹 Verificar que el post exista (MUCHO mejor que findAll)
    const postExistente = await Text.findByPk(idPost);
    if (!postExistente) {
      if (image) fs.unlinkSync(image.path);
      return res.status(400).json({ message: "Post inexistente" });
    }

    // 🔹 Verificar serial único
    const serialExistente = await Chat.findOne({ where: { serial } });
    if (serialExistente) {
      if (image) fs.unlinkSync(image.path);
      return res.status(400).json({ message: "Serial inválido" });
    }

    // 🔹 Si hay imagen → validación REAL
    if (image) {
      filePath = image.path;

      const buffer = fs.readFileSync(filePath);
      const type = await fileTypeFromBuffer(buffer);

      const allowedMime = ["image/jpeg", "image/png", "image/webp"];

      if (!type || !allowedMime.includes(type.mime)) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Archivo inválido" });
      }
    }

    // 🔹 Crear chat
    const nuevoChat = await Chat.create({
      data,
      idPost,
      serial,
      replyTo,
      image: image ? image.filename : null,
    });

    io.emit("nuevo_mensaje", nuevoChat);

    res.json(nuevoChat);

  } catch (error) {
    console.error(error);

    // 🔥 Si algo falla y había imagen → la borramos
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({ error: "Error al crear el chat" });
  }
};
