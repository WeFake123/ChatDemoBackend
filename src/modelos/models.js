import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Text = sequelize.define("texto", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    text:{
        type: DataTypes.STRING,
        allowNull: false,
    }

})

