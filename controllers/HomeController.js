const connection = require("../database/db")
const UserController = require("./UserController")
const RestaurantController = require("./RestaurantController")
const DishController = require("./DishController")
const AddressController = require("./AddressController")
const ClientController = require("./ClientController")
const OrderController = require("./OrderController")
const DeliveryManController = require("./DeliveryManController")

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
                    res.redirect("/painel/restaurante")
                    break;
                
                case 2: //entregador
                    res.redirect("/painel/entregador")
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

    async acompanhar (req, res) {
        
        const id_pedido = req.params.id_pedido

        const pedido = await OrderController.findById(id_pedido)
        const restaurante = await RestaurantController.findById(pedido.id_restaurante)
        const entregador = await DeliveryManController.findById(pedido.id_entregador)

        const total = pedido.detalhe_pedido.data.total
        const tempo = pedido.tempo_estimado_minutos
        const is_finalizado = pedido.is_finalizado

        res.render("acompanhar/index", {
            restaurante: restaurante,
            entregador: entregador,
            total: total,
            tempo: tempo,
            is_finalizado: is_finalizado
        })

    }

    async painelEntregador (req, res) {

        try {

            const id_usuario = req.session.passport.user
            const entregador = await DeliveryManController.findByUserId(id_usuario)
            const pedidos = await OrderController.findByDeliveryManId(entregador.id_entregador)
            
            if (!pedidos) {
                res.render("entregador/painel/index", {
                    error: true,
                    message: "Não há nenhum pedido atualmente."
                })

            } else {

                const restaurante = await RestaurantController.findById(pedidos[0].id_restaurante)
                const cliente = await ClientController.findById(pedidos[0].id_cliente)

                const enderecoCliente = await AddressController.findByUserId(cliente.id_usuario)
                const enderecoRestaurante = await AddressController.findByUserId(restaurante.id_usuario)

                res.render("entregador/painel/index", {
                    error: false,
                    pedido: pedidos[0],
                    enderecoCliente: enderecoCliente,
                    enderecoRestaurante: enderecoRestaurante,
                    restaurante: restaurante,
                    cliente: cliente
                })

            }
            
        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
        }

    }

    async painelRestaurante (req, res) {

        try {

            const restaurante = await RestaurantController.findByUserId(req.session.passport.user)
            var pedidosAndamento = await OrderController.findAllByRestaurantId(restaurante.id_restaurante)

            for(let i = 0; i < pedidosAndamento.length; i++) {

                for (let j = 0; j < pedidosAndamento[i].detalhe_pedido.data.itens.length; j++) {

                    var prato = await DishController.findById(pedidosAndamento[i].detalhe_pedido.data.itens[j].id_prato)
                    pedidosAndamento[i].detalhe_pedido.data.itens[j].nome_prato = prato.nome

                }

            }

            res.render("restaurante/painel/index", {
                restaurante: restaurante,
                pedidos: pedidosAndamento
            })
            
        } catch (error) {
            console.log(error)
            res.redirect("/redirect")            
        }

    }
 
}

module.exports = new HomeController()