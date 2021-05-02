const connection = require("../database/db")
const RestaurantController = require("./RestaurantController")

class DishController {

    async create(req, res) {

        const is_disponivel = true

        const id_user = req.session.passport.user
        const restaurant = await RestaurantController.findByUserId(id_user)

        const {
            nome, descricao, preco, tipo
        } = req.body

        //validar dados antes de inserir

        try {

            const dish = await connection.insert({
                id_restaurante: restaurant.id_restaurante,
                nome,
                descricao,
                preco,
                tipo,
                is_disponivel
            }).into("pratos")

            if (dish) res.redirect("/restaurante/painel")
            else res.redirect("/prato/create")
            
        } catch (error) {
            console.log(error)
            res.redirect("/prato/create")    
        }

    }

    async findDishesByRestaurantId (id_restaurante) {

        try {
            
            const dishes = await connection.select("*").from("pratos").where({ id_restaurante: id_restaurante })
            
            if (dishes.length) return dishes
            else return undefined

        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findById (id) {

        try {
            
            const prato = await connection.select("*").from("pratos").where({ id_prato: id })
            
            if (prato.length) return prato[0]
            else return undefined

        } catch (error) {
            console.log(error)
            return undefined
        }

    }


}

module.exports = new DishController()