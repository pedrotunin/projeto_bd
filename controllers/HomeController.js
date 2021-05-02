const connection = require("../database/db")
const UserController = require("./UserController")
const RestaurantController = require("./RestaurantController")
const DishController = require("./DishController")
const AddressController = require("./AddressController")
const ClientController = require("./ClientController")

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

        const user_id = req.session.passport.user
        const cliente = await ClientController.findByUserId(user_id)

        try {

            const carrinho = await connection.select("*").from("carrinho").where({ id_cliente: cliente.id_cliente })

            if (!carrinho.length) {
                res.render("carrinho/index", {error: "Carrinho Vazio!"})
            }

            const restaurante = await RestaurantController.findById(carrinho[0].id_restaurante)
            
            var itens = []
            var total = 0

            for (let i = 0; i < carrinho.length; i++) {

                const prato = await DishController.findById(carrinho[i].id_prato)

                const novoItem = {
                    id_prato: prato.id_prato,
                    quantidade: carrinho[i].qtd_prato,
                    nome: prato.nome,
                    descricao: prato.descricao,
                    preco: prato.preco,
                    caminho_foto: prato.caminho_foto
                }

                total += prato.preco * carrinho[i].qtd_prato

                itens.push(novoItem)

            }

            res.render("carrinho/index", {
                restaurante,
                itens,
                total,
                error: undefined
            })
            
        } catch (error) {
            
        }

    }

    async ckeckout (req, res) {

        const user_id = req.session.passport.user
        const cliente = await ClientController.findByUserId(user_id)

        try {

            const carrinho = await connection.select("*").from("carrinho").where({ id_cliente: cliente.id_cliente })

            if (!carrinho.length) {
                res.render("carrinho/index", {error: "Carrinho Vazio!"})
            }

            const restaurante = await RestaurantController.findById(carrinho[0].id_restaurante)

            var total = 0

            for (let i = 0; i < carrinho.length; i++) {

                const prato = await DishController.findById(carrinho[i].id_prato)

                total += prato.preco * carrinho[i].qtd_prato
            }

            res.render("checkout/index", {
                restaurante,
                total
            })


        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
            
        }

    }
 
}

module.exports = new HomeController()