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

}

module.exports = new DeliveryManController()