import { Text } from "../modelos/models.js";
import { Chat } from "../modelos/models.js";



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

    if (!name || !text || !image) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

    const nuevoTexto = await Text.create({
      name,
      text,
      image: image.filename, // 👈 guardamos solo el nombre
    });

    res.json(nuevoTexto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
};


//----------------------------------------------------------

export const getChat = async (req, res) => {
  try {
    const textos = await Chat.findAll();
    res.json(textos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Chats" });
  }
};

export const postChat = async (req, res) => {
  try {
    const {data, father } = req.body;

    if (!data ) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

    const nuevoChat = await Chat.create({
      data,
      father
    });

    res.json(nuevoChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el chat" });
  }
};
