const connection = require("../database/db")
const CartController = require("./CartController")
const DeliveryManController = require("./DeliveryManController")
const ClientController = require("./ClientController")

async function tratarItens(itens) {


    itens.forEach(item => {

        delete item.id_restaurante
        delete item.id_cliente
        
    });

    return itens

}

async function getRandomTime() {

    const max = 60, min = 30
    return parseInt(Math.random() * (max - min)  + min)

}

class OrderController {

    async create (req, res) {

        const {
            meio_pagamento, troco_para, numero_cartao,
            nome_cartao, validade_cartao, cvv, total
        } = req.body

        var itens = await CartController.getItemsByUserId(req.session.passport.user)

        if (itens == undefined) {}//erro

        const id_restaurante = itens[0].id_restaurante
        const cliente = await ClientController.findByUserId(req.session.passport.user)

        var obj = {}

        if (meio_pagamento == "card") {

            obj = {
                tipo: "card",
                data: {
                    numero: numero_cartao,
                    nome_titular: nome_cartao,
                    valdidade: validade_cartao,
                    cvv: cvv
                }
            }

        } else { //money
            
            obj = {
                tipo: "money",
                data: {
                    troco_para: troco_para
                }
            }

        }

        try {

            itens = await tratarItens(itens)

            const detalhe_pedido = {
                data: {
                    total: total,
                    itens: itens
                }
            }

            const entregador = await DeliveryManController.findAvailable()

            if (!entregador) res.redirect("/redirect")

            const tempo = await getRandomTime()

            await connection.insert({
                id_cliente: cliente.id_cliente,
                id_restaurante: id_restaurante,
                id_entregador: entregador,
                detalhe_pedido: detalhe_pedido,
                detalhe_pagamento: obj,
                tempo_estimado_minutos: tempo,
                is_finalizado: false
            }).into("pedidos")

            const result = await connection.select("id_pedido").from("pedidos").orderBy("id_pedido", "desc").where({ id_cliente: cliente.id_cliente })

            const id_pedido = result[0].id_pedido

            await CartController.cleanCartByUserId(req.session.passport.user)

            res.redirect(`/acompanhar/${id_pedido}`)
            
        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
        }

    }

    async entregue (req, res) {

        const id = req.params.id

        try {

            await connection.update("is_finalizado", true).from("pedidos").where({ id_pedido: id })

            res.redirect("/redirect")
            
        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
        }

    }

    async findById (id) {

        try {

            const pedido = await connection.select("*").from("pedidos").where({ id_pedido: id })

            if (pedido.length) return pedido[0]
            return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findByDeliveryManId (id_entregador) {

        try {
            
            const pedido = await connection.select("*").from("pedidos").where({ is_finalizado: false, id_entregador: id_entregador })

            if (pedido.length) return pedido
            return undefined

        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findAllByRestaurantId (id_restaurante) {

        try {

            const pedidos = await connection.select("*").from("pedidos").where({ id_restaurante: id_restaurante, is_finalizado: false }).orderBy("id_pedido","desc")

            if (pedidos.length) return pedidos
            return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    

}

module.exports = new OrderController()