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

        var errors = []

        if (nome == undefined || telefone.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }

        if (cpf == undefined  || !validator.isNumeric(cpf) || cpf.length != 11) {
            errors.push("CPF inválido! Digite um CPF válido!")
        }

        if (rg == undefined  || !validator.isNumeric(rg) || cpf.length < 8) {
            errors.push("RG inválido! Digite um RG válido!")
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

    validateRestaurant(data) {

        const { nome_oficial, nome_fantasia, cnpj, raio_atendimento, hora_abre, hora_fecha, tipo } = data
        
        var errors = []

        if (nome_oficial == undefined || nome_oficial.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }

        if (nome_fantasia == undefined || nome_fantasia.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }

        if (cnpj == undefined) {
            errors.push("CNPJ inválido! Digite um CNPJ válido!")
        }

        if (hora_abre == undefined  || !validator.isNumeric(hora_abre) || hora_abre < 0 || hora_abre > 23) {
            errors.push("Horário inválido! Digite um Horário válido!")
        }

        if (hora_fecha == undefined  || !validator.isNumeric(hora_fecha) || hora_fecha < 0 || hora_fecha > 23) {
            errors.push("Horário inválido! Digite um Horário válido!")
        }
        
        if (tipo == undefined || tipo.length < 3) {
            errors.push("Tipo inválido! Digite um Tipo válido!")
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

    validateDeliveryMan(data) {

        const { nome, cpf, tipo_veiculo, placa_veiculo, modelo_veiculo, ano_veiculo} = data

        var errors = []

        if (nome == undefined || nome.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }

        if (cpf == undefined  || !validator.isNumeric(cpf) || cpf.length != 11) {
            errors.push("CPF inválido! Digite um CPF válido!")
        }

        if (tipo_veiculo == undefined  || tipo_veiculo.length < 4) {
            errors.push("Tipo de veículo inválido! Digite um tipo válido!")
        }

        if (placa_veiculo == undefined  || placa_veiculo.length < 7) {
            errors.push("Placa inválida! Digite uma placa válida!")
        }

        if (modelo_veiculo == undefined  || modelo_veiculo.length < 3) {
            errors.push("Modelo do veículo inválido! Digite um modelo válido!")
        }

        const year = new Date().getFullYear()
        if (ano_veiculo == undefined  || ano_veiculo.length < 4 || ano_veiculo < 2000 || ano_veiculo > year + 1) {
            errors.push("Ano de veículo inválido! Digite um ano válido!")
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

    validateDish(data) {

        const { nome, descricao, preco, tipo } = data

        var errors = []

        if (nome == undefined || nome.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }
        
        if (descricao == undefined || descricao.length < 5) {
            errors.push("Descrição inválida! Digite uma descricao maior!")
        }

        if (preco == undefined  || !validator.isNumeric(preco)) {
            errors.push("Preço inválido! Digite um valor válido!")
        }

        if (tipo == undefined || tipo.length < 3) {
            errors.push("Tipo inválido! Digite um Tipo válido!")
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

    validateCard(data) {

        const {numero, nome, cvv, mes_validade, ano_validade} = data

        var errors = []

        if (numero == undefined  || !validator.isNumeric(numero) || numero.length < 13 || numero.length > 16) {
            errors.push("Número de cartão inválido! Digite um número válido!")
        }

        if (nome == undefined || nome.length < 3) {
            errors.push("Nome inválido! Digite um Nome válido!")
        }

        if (cvv == undefined  || !validator.isNumeric(cvv) || numero.length < 3 || numero.length > 4) {
            errors.push("CVV inválido! Digite um CVV válido!")
        }

        if (mes_validade == undefined  || !validator.isNumeric(mes_validade) || mes_validade < 1 || mes_validade > 12) {
            errors.push("Mês de validade inválido! Digite um mês válido!")
        }

        const year = new Date().getFullYear()
        if (ano_validade == undefined  || !validator.isNumeric(ano_validade) || ano_validade < year) {
            errors.push("Ano de validade inválido! Digite um ano válido!")
        }

        const month = new Date().getMonth()
        if (mes_validade < month && ano_validade <= year){
            errors.push("O cartão está vencido!")
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