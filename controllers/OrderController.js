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


            /*await connection.insert({
                id_cliente: cliente.id_cliente,
                id_restaurante: id_restaurante,
                id_entregador: 1,
                detalhe_pedido: detalhe_pedido,
                detalhe_pagamento: obj,
                tempo_estimado_minutos: 35,
                is_finalizado: false
            }).into("pedidos")*/
            
        } catch (error) {
            console.log(error)
            res.redirect("/redirect")
        }

    }


}

module.exports = new OrderController()