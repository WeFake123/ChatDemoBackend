import {Router} from "express";
import {getText, postText} from "../function/functions.js"


const router = Router();


router.get("/", getText);

router.post("/", postText);











export default router