import {Router} from "express";
import {getText, postText} from "../function/functions.js"

import upload from "../middleware/upload.js";

const router = Router();


router.get("/", getText);

router.post("/", upload.single("image"), postText);











export default router