const connection = require("../database/db")
const UserController = require("./UserController")
const ContactController = require("./ContactController")
const AddressController = require("./AddressController")

const Validate = require("../utils/validate")

class RestaurantController {

    async create (req, res) {

        //tipo = 1 para restaurantes
        const tipo = 1
        const { 
            nome_oficial, nome_fantasia, email, senha, repetir_senha, cnpj, telefone, 
            cep, logradouro, numero, complemento,
            raio, inicio, fim, tipo_comida
        } = req.body
    
        //tratar dados
        //se não tiver nenhum erro cadastrar no banco de dados
    
        try {
    
            const novoUsuario = await UserController.create(email, senha, tipo)
            const idNovoUsuario = novoUsuario[0].id
    
            await connection.insert({
                id_usuario: idNovoUsuario,
                nome_oficial,
                nome_fantasia,
                cnpj,
                raio_atendimento: raio,
                hora_abre: inicio,
                hora_fecha: fim,
                tipo: tipo_comida
            }).into("restaurantes")
    
            await ContactController.create(idNovoUsuario, telefone)
            await AddressController.create(idNovoUsuario, cep, logradouro, numero, complemento)

            res.redirect("/redirect")
    
        } catch (error) {
    
            console.log(error)
    
        }

    }

    async findByUserId (user_id) {

        try {
            
            const restaurante = await connection.select("*").from("restaurantes").where({ id_usuario: user_id })

            if (restaurante.length) return restaurante[0]
            else return undefined

        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findById (id) {

        try {

            const restaurante = await connection.select("*").from("restaurantes").where({ id_restaurante: id })

            if (restaurante.length) return restaurante[0]
            else return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

}

module.exports = new RestaurantController()