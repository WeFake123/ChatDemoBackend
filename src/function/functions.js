import { Text } from "../modelos/models.js"

export const getText = async(req, res) => {
    const textos = await Text.findAll();
    res.json(textos)
}

export const postText = async(req, res) => {
    const {name, text} = req.body;

    if(!name || !text){ res.status(400).send({message: "Campos incompletos"})};

    const nuevoTexto = await Text.create({
        name, text
    })
    res.json(nuevoTexto)
}