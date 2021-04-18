const connection = require("../database/db")
const UserController = require("./UserController")
const ContactController = require("./ContactController")
const AddressController = require("./AddressController")

class ClientController {

    async create (req, res) {

        //tipo = 0 para clientes
        const tipo = 0
        const { 
            nome, email, senha, repetir_senha, cpf, rg, telefone, 
            cep, logradouro, numero, complemento 
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
                rg
            }).into("clientes")
    
            await ContactController.create(idNovoUsuario, telefone)
            await AddressController.create(idNovoUsuario, cep, logradouro, numero, complemento)

            res.redirect("/redirect")
    
        } catch (error) {
    
            console.log(error)
    
        }

    }
    

}

module.exports = new ClientController()