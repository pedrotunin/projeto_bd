const express = require("express")
const router = express.Router();
const passport = require("passport")

const ClientController = require('../controllers/ClientController')
const RestaurantController = require("../controllers/RestaurantController")
const DeliveryManController = require("../controllers/DeliveryManController")
const HomeController = require("../controllers/HomeController")
const LoginController = require("../controllers/LoginController")

const MiddleWares = require("../middlewares/middlewares")

//HomeController
router.get("/", HomeController.index)
router.get("/cadastro/:tipo", HomeController.cadastro)
router.get("/login", HomeController.login)
router.get("/redirect", HomeController.redirect)

router.get("/restaurantes", MiddleWares.isClient, HomeController.restaurantes)
router.get("/restaurante/:id", MiddleWares.isClient, HomeController.pratos)

//LoginController
router.post("/login", passport.authenticate("local", {
    successRedirect: "/redirect",
    failureRedirect: "/login?fail=true"
}))

//ClientController
router.post("/cliente", ClientController.create)

//RestaurantController
router.post("/restaurante", RestaurantController.create)

//DeliverManController
router.post("/entregador", DeliveryManController.create)

module.exports = router