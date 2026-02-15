import { Text } from "../modelos/models.js";
import { Chat } from "../modelos/models.js";
import { Op } from "sequelize";

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
  try {
    const { name, text } = req.body;
    const image = req.file; // 👈 imagen viene de multer
       const ip = req.ip;

    if (!name || !text || !image) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

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
      return res.status(429).json({
        message: "Esperá 5 minutos antes de volver a postear"
      });
    }

    const nuevoTexto = await Text.create({
      name,
      text,
      image: image.filename, // 👈 guardamos solo el nombre
      ip
    });

        io.emit("nuevo_post", nuevoTexto);



    res.json(nuevoTexto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post"});
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
  try {
    const {data, idPost, serial, replyTo} = req.body;
    const image = req.file;

    if (!data ) {
      return res.status(400).json({ message: "Campos incompletos" });
    }
    
    const textos = await Text.findAll();

    if(!textos.some((i) => i.id == idPost)){
      return res.status(400).json({ message: "Post Inexistnte" });
    }
    
    const chat = await Chat.findAll();
    if(chat.some((i) => i.serial == serial)){
      return res.status(400).json({ message: "valores invalidos" });
    }



    const nuevoChat = await Chat.create({
      data,
      idPost,
      serial,
      replyTo,
      image: req.file ? req.file.filename : null,  // 🔥 FIX
    });

    io.emit("nuevo_mensaje", nuevoChat);

    res.json(nuevoChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el chat" });
  }
};
