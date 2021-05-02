const connection = require("../database/db")
const ClientController = require("./ClientController")

class CartController {

    async addItem (req, res) {

        const { id_prato, id_restaurante, qtd_prato } = req.body
        const user_id = req.session.passport.user
        const cliente = await ClientController.findByUserId(user_id)

        try {

            const result = await connection.insert({
                id_cliente: cliente.id_cliente,
                id_restaurante,
                id_prato,
                qtd_prato
            }).into("carrinho")

            res.redirect(`/restaurante/${id_restaurante}`)
            
        } catch (error) {
            console.log(error)
            res.redirect(`/restaurante/${id_restaurante}`)
        }

        
    }

    async cleanCart (req, res) {

        const user_id = req.session.passport.user
        const cliente = await ClientController.findByUserId(user_id)

        try {

            const result = await connection.delete("*").from("carrinho").where({ id_cliente: cliente.id_cliente })

            res.redirect("/redirect")
            
        } catch (error) {
            console.log(error)
            res.redirect("/carrinho")
            
        }

    }

    async cleanCartByUserId (id) {

        const user_id = id
        const cliente = await ClientController.findByUserId(user_id)

        try {

            const result = await connection.delete("*").from("carrinho").where({ id_cliente: cliente.id_cliente })
            
        } catch (error) {
            console.log(error)
        }

    }

    async removeItem (req, res) {

    }

    async getItemsByUserId (user_id) {

        const cliente = await ClientController.findByUserId(user_id)

        try {

            const itens = await connection.select("*").from("carrinho").where({ id_cliente: cliente.id_cliente })

            if (itens.length) return itens
            return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

}

module.exports = new CartController()