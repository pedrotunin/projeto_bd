const connection = require("../database/db")
const Utils = require("../utils/validate")
const bcrypt = require('bcrypt')
const saltRounds = 13

class UserController {

    async create (email, senha, tipo) {

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(senha, salt);

        try {

            await connection.insert({
                email,
                senha: hash,
                tipo
            }).into("usuarios")
    
            const novoUsuario = await connection.select("id").from("usuarios").where({ email: email })
    
            return novoUsuario
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findByEmail (email) {

        try {
            
            const user = await connection.select("*").from("usuarios").where({ email: email })

            if (!user) return undefined
            else return user[0]

        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findById (id) {

        try {
            
            const user = await connection.select("*").from("usuarios").where({ id: id })

            if (!user) return undefined
            else return user[0]

        } catch (error) {
            console.log(error)
            return undefined
        }

    }

    async findTypeById (id) {

        try {

            const user = await connection.select("tipo").from("usuarios").where({ id: id })

            if (!user) return undefined
            else return user[0].tipo
            
        } catch (error) {
            console.log(error)
            return undefined
        }

    }

}

module.exports = new UserController()

