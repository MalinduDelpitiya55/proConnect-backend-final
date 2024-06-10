import express from "express";

import { ResetPassword, ForgetPassword} from "./../controllers/password.control.js";
const router = express.Router();

router.post('/forgetPassword',ForgetPassword)
router.post('/ResetPassword',ResetPassword)

export default router;