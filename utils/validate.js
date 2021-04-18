const connection = require("../database/db")
const validator = require("validator")
const UserController = require("../controllers/UserController")

class Validate {

    validateUser(data) {

        const { email, senha, repetir_senha } = data 

        var errors = []

        if (UserController.findByEmail(email) != undefined) {
            errors.push("E-mail já cadastrado no sistema. Tente usar outro e-mail!")
        }

        if (!validator.isEmail(email)) {
            errors.push("E-mail inválido! Digite um e-mail válido!")
        }

        if (senha == undefined || senha.length < 6) {
            errors.push("Senha inválida! A senha tem que conter pelo menos 6 caracteres!")
        }

        if (validator.equals(senha, repetir_senha)) {
            errors.push("As senhas digitadas não são iguais! Digite novamente!")
        }

        if (errors.length) {
            return {
                status: false,
                errors
            }
        }

        return {
            status: true,
            errors: []
        }

    }

    validateClient(data) {

        const { nome, cpf, rg } = data

        

    }

    validateRestaurant(data) {

    }

    validateDeliveryMan(data) {

    }

    validateContact(data) {

        const { telefone } = data

        var errors = []

        if (telefone == undefined || telefone.length < 8) {
            errors.push("Telefone inválido! Digite um telefone válido!")
        }

        if (error.length) {
            return {
                status: false,
                errors
            }
        }

        return {
            status: true,
            errors: []
        }

    }

    validateAddress(data) {

        const { cep, logradouro, numero } = data

        if (!validator.isPostalCode(cep, "BR")) {
            errors.push("CEP inválido! Digite um CEP válido!")
        }

        if (logradouro == undefined || logradouro.length < 4) {
            errors.push("Logradouro inválido! Digite um logradouro válido!")
        }

        if (numero == undefined || numero.length == 0) {
            errros.push("Número inválido! Digite um número válido!")
        }

        if (errors.length) {
            return {
                status: false,
                errors
            }
        }

        return {
            status: true,
            errors: []
        }

    }

}

module.exports = new Validate()