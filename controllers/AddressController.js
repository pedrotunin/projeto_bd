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

    async findByUserId(user_id) {

        try {

            const endereco = await connection.select("logradouro","numero").from("enderecos").where({ id_usuario: user_id })

            if (endereco.length) return endereco[0]
            else return undefined
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

}

module.exports = new AddressController()