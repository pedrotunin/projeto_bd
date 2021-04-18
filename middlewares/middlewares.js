const UserController = require("../controllers/UserController")

class MiddleWares {

    async isLogged (req, res, next) {

        if (req.isAuthenticated()) return next()
        else res.redirect("/login")

    }

    async isClient (req, res, next) {

        const id = req.session.passport.user

        if (req.isAuthenticated() && await UserController.findTypeById(id) == 0) return next()
        else res.redirect("/redirect")

    }

    async isRestaurant (req, res, next) {

        const id = req.session.passport.user

        if (req.isAuthenticated() && await UserController.findTypeById(id) == 1) return next()
        else res.redirect("/redirect")

    }

    async isDeliveryMan (req, res, next) {

        const id = req.session.passport.user

        if (req.isAuthenticated() && await UserController.findTypeById(id) == 2) return next()
        else res.redirect("/redirect")

    }

 }

 module.exports = new MiddleWares()