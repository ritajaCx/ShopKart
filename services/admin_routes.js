const controller = require('./admin_controller')   //import controller

module.exports = function(admin){

    admin.route("/").get(controller.home) 

    //login + verify
    admin.route("/login").get(controller.login) 
    admin.route("/loginverify").post(controller.loginverify) 

    //view all ads
    admin.route("/viewads").get(controller.viewAds)
    
    admin.route("/viewaddet/:id").get(controller.reqDetailview)  
    admin.route("/sendmail").post(controller.sendMail) 
            
    //view all members
    admin.route("/viewmem").get(controller.viewMem)

    //view member details by ID
    admin.route("/viewmemdet/:id").get(controller.viewMemDet)  

    //logout
    admin.route("/logout").get(controller.logout) 
        
    


}