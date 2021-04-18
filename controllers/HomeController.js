const connection = require("../database/db")
const UserController = require("./UserController")
const RestaurantController = require("./RestaurantController")
const DishController = require("./DishController")
const AddressController = require("./AddressController")

class HomeController{

    async index (req, res) {

        //console.log(req.session.passport.user)
        
        res.render("index")
    }

    async redirect (req, res) {

        if (req.isAuthenticated()) {

            const tipo = await UserController.findTypeById(req.session.passport.user)

            switch (tipo) {

                case 0: // cliente
                    res.redirect("/restaurantes")
                    break;
                
                case 1: //restaurante
                    res.redirect("/restaurante/painel")
                    break;
                
                case 2: //entregador
                    res.redirect("/entregador/painel")
                    break;

                default:
                    res.redirect("/login")
                    break;

            }

        } else {
            res.redirect("/login")
        }

    }

    async cadastro (req, res) {
        const tipo = req.params.tipo
        res.render("cadastro/index", { tipo: tipo })
    }

    async login (req, res) {
        if (req.query.fail)
            res.render("login/index", { message: "E-mail ou senha inválidos!" })
        else
            res.render("login/index", { message: null })
    }

    async restaurantes (req, res) {

        try {
            
            const result = await connection.select("id_restaurante","nome_fantasia","tipo","hora_abre","hora_fecha").from("restaurantes")

            const data = new Date();
            const hora = data.getHours();

            result.forEach(restaurante => {

                if (hora >= restaurante.hora_abre && hora < restaurante.hora_fecha) {
                    restaurante.aberto = true 
                } else {
                    restaurante.aberto = false
                }
                
            })

            res.render("restaurante/index", { restaurantes: result })

        } catch (error) {
            res.redirect("/")
            console.log(error)
        }
        
    }

    async novoPrato (req, res) {

        res.render("prato/create")

    }

    async pratos (req, res) {

        try {

            const id_restaurante = req.params.id

            const restaurante = await RestaurantController.findById(id_restaurante)
            const pratos = await DishController.findDishesByRestaurantId(id_restaurante)
            const endereco = await AddressController.findByUserId(restaurante.id_usuario)

            if (restaurante && pratos && endereco) {

                res.render("prato/index", { 
                    restaurante: restaurante,
                    pratos: pratos,
                    endereco: endereco
                })

            } else {
                res.redirect("/redirect")
            }

        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
        }

    }

    async carrinho (req, res) {

        res.render("carrinho/index")

    }
 
}

module.exports = new HomeController()