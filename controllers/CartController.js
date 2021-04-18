const connection = require("../database/db")
const ClientController = require("./ClientController")

class CartController {

    async addItem (req, res) {

        const { id_prato, id_restaurante, qtd_prato } = req.body
        const user_id = req.session.passport.user
        const cliente = await ClientController.findByUserId(user_id)

        try {
            
        } catch (error) {
            
        }

    }

    async removeItem (req, res) {

    }

    async getItemsByUserId (user_id) {

    }

}

module.exports = new CartController()