const connection = require("../database/db")
const bcrypt = require("bcrypt")
const passport = require("passport")

class LoginController {

    async login () {

        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login?fail=true"
        })

    }

}

module.exports = new LoginController()