const express = require("express")
const app = express()
const bodyParser = require ("body-parser")
const connection = require("./database/db")
const router = require("./routes/routes")

const passport = require("passport")
const session = require("express-session")
require("./database/auth")(passport)

//configura a view engine do projeto
app.set("view engine", "ejs")
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//configura a sessão do usuário logado
app.use(session({
    secret: 'dd8akd546s65ladnsad1685',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}))
app.use(passport.initialize())
app.use(passport.session())

//direciona todas as rotas para o router
app.use("/", router)

const PORT = 3333
app.listen(PORT, () => {
    console.log("Site rodando!")
})