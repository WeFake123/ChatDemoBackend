import { Chat, Text } from "../modelos/models.js";
import { Op } from "sequelize";
import { io } from "../node.js";

/* ===============================
   TEXTOS (POST PRINCIPAL)
================================= */

export const getText = async (req, res) => {
  try {
    const textos = await Text.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(textos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener textos" });
  }
};

export const postText = async (req, res) => {
  try {
       console.log(req.body)
    const { name, text } = req.body;
    const ip = req.ip;
 
    if (!name || !text || !req.file) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

    // 🔹 Cooldown por IP (5 minutos)
    const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

    const ultimoPost = await Text.findOne({
      where: {
        ip,
        createdAt: { [Op.gt]: cincoMinutosAtras },
      },
    });

    // if (ultimoPost) {
    //   return res.status(429).json({
    //     message: "Esperá 5 minutos antes de volver a postear",
    //   });
    // }
         console.log(req.file)

     const imageUrl = req.file.originalname;

     console.log(imageUrl)


    const nuevoTexto = await Text.create({
      name,
      text,
      image: imageUrl,
      ip,
    });

    io.emit("nuevo_post", nuevoTexto);

    res.json(nuevoTexto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
};

export const getTextId = async (req, res) => {
  try {
    const { id } = req.params;

    const texto = await Text.findByPk(id);

    if (!texto) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json(texto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el post" });
  }
};

/* ===============================
   CHAT (RESPUESTAS)
================================= */

export const getChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chats = await Chat.findAll({
      where: { idPost: id },
      order: [["createdAt", "ASC"]],
    });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener chats" });
  }
};

export const postChat = async (req, res) => {
  try {
    const { data, idPost, serial, replyTo } = req.body;

    if (!data || !idPost || !serial) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

    const postExistente = await Text.findByPk(idPost);
    if (!postExistente) {
      return res.status(400).json({ message: "Post inexistente" });
    }

    const serialExistente = await Chat.findOne({ where: { serial } });
    if (serialExistente) {
      return res.status(400).json({ message: "Serial inválido" });
    }

    // 🔹 Multer ya subió la imagen si existe

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const nuevoChat = await Chat.create({
      data,
      idPost,
      serial,
      replyTo: replyTo === "" ? null : replyTo,
      image: imageUrl,
    });

    io.emit("nuevo_mensaje", nuevoChat);

    res.json(nuevoChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el chat" });
  }
};
