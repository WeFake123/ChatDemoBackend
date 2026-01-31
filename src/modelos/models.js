import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Text = sequelize.define("texto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(35),
        allowNull: false,
        validate: {
            len: [1, 35], // seguridad extra
        },
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING, // ruta o URL
        allowNull: true,
    }
});

export const Chat = sequelize.define("chat", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    father: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});
