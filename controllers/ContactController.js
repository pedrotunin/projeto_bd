const connection = require("../database/db")

class ContactController {

    async find (id_usuario) {

        try {

            const result = await connection.select({ numero }).from("telefones").where({ id_usuario })
            return result
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findAll () {

        try {

            const result = await connection.select("*").from("telefones").where({ id_usuario })
            return result
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async create (id_usuario, numero) {

        try {

            await connection.insert({
                id_usuario,
                numero
            }).into("telefones")
            
        } catch (error) {
            console.log(error)
        }

    }

    async delete (id_usuario, numero) {

        try {

            await connection.delete("*").from("telefones").where({
                id_usuario,
                numero
            })
            
        } catch (error) {
            console.log(error)
        }

    }

    async update (id_usuario, numero_antigo, numero_novo) {

        try {

            await connection.update({ numero: numero_novo }).from("telefones").where({
                id_usuario: id_usuario,
                numero: numero_antigo
            })
            
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = new ContactController()