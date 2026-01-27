import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Text = sequelize.define("texto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [1, 20], // seguridad extra
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
    data: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    father: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});
