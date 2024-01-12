import { Router } from "express";
import { index, login, logout, secret } from "../controllers/auth.controller.js";
import passport from "passport";
import checkAuthenticated from "../middlewares/checkAuthenricated.js";

const router = Router()

router.route('/').get(index)
router.route('/login').get(login)
router.route('/secret').get(checkAuthenticated, secret)
router.route('/logout').get(logout)

router.route('/login').post(
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/secret',
  }),
  (req, res) => {
    console.log(req.user);
  }
);

export default router