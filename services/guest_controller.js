const { Admin } = require("mongodb")
const dbcontroller = require("./guest_db")
const emailController = require("./sendmail")

dbcontroller.dbcontroller.connection()

var controller = {
    home: function (req, res) {
        res.render("guest_home", { title: "Guest Home Page" })
    },

    viewallad: function (req, res) {
        dbcontroller.dbcontroller.viewallads(res)
    },

    viewAdDet: function (req, res) {
        var id = req.params.id
        dbcontroller.dbcontroller.viewaddet(id, res)
    },

    contactMember: function (req, res) {
        var id = req.params.id
        dbcontroller.dbcontroller.contactmember(id, res)
    },

    sendMail: async function (req, res) {
        var memberData = {
            id: req.body.mid,
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            adminemail: req.body.adminemail
        }
        mailBody = "Hi " + memberData.name + ", " + "<br><p> You have a message from a buyer at AdManager !</p><p>Message:<b>" + memberData.message + "</b</p>"
       emailController.send(memberData.email, memberData.adminemail, "ashokraj.kp@otomeyt.ai", "Contact Mail", mailBody)
        res.redirect("/guest/viewallads")
    },

}

module.exports = controller