const controller = require("./guest_controller")

module.exports = function(guest){

    guest.route("/").get(controller.home) 

    guest.route('/viewallads').get(controller.viewallad)

    guest.route('/viewaddet/:id').get(controller.viewAdDet)

    guest.route('/contactMember/:id').get(controller.contactMember)

    guest.route('/sendmail').post(controller.sendMail)

}