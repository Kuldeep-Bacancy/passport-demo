import { Router } from "express";
import { index, login, logout, secret, signUp, register } from "../controllers/auth.controller.js";
import passport from "passport";
import checkAuthenticated from "../middlewares/checkAuthenricated.js";

const router = Router()

router.route('/').get(index)
router.route('/login').get(login)
router.route('/register').get(register)
router.route('/signup').post(signUp)
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
)

router.route('/auth/google').get(
  passport.authenticate('google', { scope: ['profile', 'email'] })
)
router.route('/auth/google/callback').get(
  passport.authenticate('google', { successRedirect: '/secret', failureRedirect: '/' })
)

export default router