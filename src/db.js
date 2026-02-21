import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

console.log("DB URL EN db.js =>", process.env.DATABASE_URL);



const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // }
});

sequelize.authenticate()
  .then(() => console.log("Postgres conectado"))
  .catch(err => console.error(err));

export default sequelize;