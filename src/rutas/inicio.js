import {Router} from "express";
import {getText, postText, getChat, postChat, getTextId} from "../function/functions.js"

import upload from "../middleware/upload.js";

const router = Router();


router.get("/inicio", getText);

router.post("/inicio", upload.single("image"), postText);



router.post("/inicio/:id", upload.single("image"), postChat);

router.get("/inicio/:id", getChat);






export default router