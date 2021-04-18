const connection = require("./db")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy

const UserController = require("../controllers/UserController")


module.exports = async function (passport) {

    async function findUser(email) {
        return await UserController.findByEmail(email)
    }

    async function findUserById(id) {
        return await UserController.findById(id)
    }

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {

            const user = await findUserById(id)
            done(null, user)
            
        } catch (error) {
            console.log(error)
            return done(error, null)
        }
    })

    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "senha"
    }, 
    async (email, senha, done) => {
        try {

            const user = await findUser(email)
            if(!user) return done(null, false) // usuário não existe no banco

            const isValid = await bcrypt.compare(senha, user.senha)

            if(!isValid) return done(null, false) //senha incorreta

            return done(null, user) // deu tudo certo
            
        } catch (error) {
            console.log(error)
            done(error, false)
        }
    }))

}