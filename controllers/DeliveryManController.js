const connection = require("../database/db")
const UserController = require("../controllers/UserController")
const ContactController = require("../controllers/ContactController")

class DeliveryManController {

    async create (req, res) {

        //tipo = 2 para entregadores
        const tipo = 2
        const {
            nome, email, senha, repetir_senha, cpf, telefone,
            tipo_veiculo, placa, nome_veiculo, ano_veiculo
        } = req.body

        //tratar dados
        //se não tiver nenhum erro cadastrar no banco de dados

        try {
    
            const novoUsuario = await UserController.create(email, senha, tipo)
            const idNovoUsuario = novoUsuario[0].id
    
            await connection.insert({
                id_usuario: idNovoUsuario,
                nome,
                cpf,
                tipo_veiculo,
                placa_veiculo: placa,
                modelo_veiculo: nome_veiculo,
                ano_veiculo

            }).into("entregadores")
    
            await ContactController.create(idNovoUsuario, telefone)

            res.redirect("/redirect")
    
        } catch (error) {
    
            console.log(error)
    
        }

    }

    async findAvailable () {

        try {

            const query = "SELECT e.id_entregador FROM entregadores e WHERE e.id_entregador NOT IN (SELECT p.id_entregador FROM pedidos p WHERE is_finalizado = false);"  

            const available = await connection.raw(query)

            if (!available.rows.length) return undefined

            const entregador = available.rows[0].id_entregador

            return entregador

            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findById (id) {

        try {

            const entregador = await connection.select("*").from("entregadores").where({ id_entregador: id })

            if (entregador.length) return entregador[0]
            return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findByUserId (user_id) {

        try {

            const entregador = await connection.select("*").from("entregadores").where({ id_usuario: user_id })

            if (entregador.length) return entregador[0]
            return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

}

module.exports = new DeliveryManController()