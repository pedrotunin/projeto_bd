const connection = require("../database/db")

class AddressController {

    async create (id_usuario, cep, logradouro, numero, complemento) {

        try {

            await connection.insert({
                id_usuario,
                cep,
                logradouro,
                numero,
                complemento
            }).into("enderecos")
            
        } catch (error) {
            console.log(error)
        }
        
    }

}

module.exports = new AddressController()