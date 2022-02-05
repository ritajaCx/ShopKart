const controller = require('./member_controller')   //import controller

module.exports = function(member){

    member.route("/").get(controller.home) 

    //login + verify
    member.route("/login").get(controller.login) 
    member.route("/loginverify").post(controller.loginverify) 

    //send password
    member.route("/forgot").get(controller.forgotView)
    member.route("/sendpassword").post(controller.sendPassword) 

    //register
    member.route("/register").get(controller.newregister)
    member.route("/memregister").post(controller.register)

    //create new ad
    // member.route("/newad/:id").get(controller.newAd)
    member.route("/newad").get(controller.uploadView)
    member.route("/newadmem").post(controller.uploadAction) 

    //view own ads list
    member.route("/viewads/:id").get(controller.viewAds)

    //view ad details
    member.route("/viewaddet/:id").get(controller.viewAdDet)

    //update ad
    member.route("/updateadview/:id").get(controller.updateAdview)
    member.route("/updatead").post(controller.updateAd)

    //update acct
    member.route("/update").get(controller.update)
    member.route("/updateprofileview/:id").get(controller.updateProfileview)
    member.route("/updateprofile").post(controller.updateProfile)

    member.route("/updatepasswordview/:id").get(controller.updatePasswordview)
    member.route("/updatepassword").post(controller.updatePassword)

    //delete ad
    member.route("/delads/:id").get(controller.deleteAds) 

    //delete all ads
    member.route("/clearad/:id").get(controller.deleteAll)
       
    //delete accounr
   member.route("/clearacct").get(controller.deleteAccount) 
    
   //logout
    member.route("/logout").get(controller.logout) 
        
    


}