const express = require("express")
const router = express.Router();
const passport = require("passport")

const ClientController = require('../controllers/ClientController')
const RestaurantController = require("../controllers/RestaurantController")
const DeliveryManController = require("../controllers/DeliveryManController")
const HomeController = require("../controllers/HomeController")
const DishController = require("../controllers/DishController");
const CartController = require("../controllers/CartController")
const OrderController = require("../controllers/OrderController")

const MiddleWares = require("../middlewares/middlewares");


//HomeController
router.get("/", HomeController.index)
router.get("/cadastro/:tipo", HomeController.cadastro)
router.get("/login", HomeController.login)
router.get("/redirect", HomeController.redirect)

router.get("/restaurantes", MiddleWares.isClient, HomeController.restaurantes)
router.get("/restaurante/:id", MiddleWares.isClient, HomeController.pratos)

router.get("/prato/create", MiddleWares.isRestaurant, HomeController.novoPrato)

router.get("/carrinho", MiddleWares.isClient, HomeController.carrinho)
router.get("/checkout", MiddleWares.isClient,  HomeController.ckeckout)

router.get("/acompanhar/:id_pedido", MiddleWares.isClient, HomeController.acompanhar)

router.get("/painel/entregador", MiddleWares.isDeliveryMan, HomeController.painelEntregador)

router.get("/painel/restaurante", MiddleWares.isRestaurant, HomeController.painelRestaurante)

//Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/redirect",
    failureRedirect: "/login?fail=true"
}))

//ClientController
router.post("/cliente", ClientController.create)

//RestaurantController
router.post("/restaurante", RestaurantController.create)

//DishController
router.post("/prato", MiddleWares.isRestaurant, DishController.create)    // inserir middleware

//DeliverManController
router.post("/entregador", DeliveryManController.create)

//CartController
router.post("/carrinho/adicionar", MiddleWares.isClient, CartController.addItem)
router.post("/carrinho/limpar", MiddleWares.isClient, CartController.cleanCart)

//OrderController
router.post("/pedido", MiddleWares.isClient, OrderController.create)
router.get("/pedido/entregue/:id",  MiddleWares.isDeliveryMan, OrderController.entregue)

module.exports = router