const dbcontroller = require('./admin_db')
const emailController = require('./sendmail')

dbcontroller.dbcontroller.connection()  //1st: to connect db variable defined in staff_db ; 2nd : to connect to mongodb conn defined in the dbcontroller variable

var currloginUser;

var controller = {


    home : function(req,res){

        if(req.session.login){

            res.render("admin_index", {title : "Admin Index Page"})
        }
        else{

            res.render("admin_login",{title : "Admin Login Page"})
        }

    },

    login : function(req,res){
        res.render("admin_login", {title: "Admin Login Page", data: null})
    },
    
    loginverify : async function(req,res){
     
        
            var email = req.body.email
            var password = req.body.password
            console.log("Session Login : Admin")
            console.log("Email : ", email)
            console.log("Password : ", password)
          
            var userdata = await dbcontroller.loginStaff(email, password)
            console.log("admin Data : ", userdata)
            currloginUser = userdata
            if (userdata != null) {
                res.render("admin_index", { title: "Admin Home Page", userdata: userdata })
            }
            else {
                
                res.render("admin_login", { title: "Admin Login Page" })
            }
    },


    viewAds: function (req, res) {
        dbcontroller.dbcontroller.viewads(res)        
    },   

    viewMem : function(req,res){
        dbcontroller.viewmem(res)
    },

    viewMemDet : function(req,res){
        var id = req.params.id
        dbcontroller.viewMemdet(res,id)
    },


    reqDetailview: function(req,res){
        var id = req.params.id
        dbcontroller.reqdetview(res,id)
    },  

    sendMail: function (req, res) {
        var memberData = {            
            id: req.body.memid,
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        }
        var adData = {
            id: req.body.adid,
            title:req.body.title
        }
        mailBody = "Hi "+memberData.name+", " + "<br><p> You have a message from Admin for "+adData.title+" ! <b>"+ adData.title + "</b></p>. </br><p>Message:<b>" + memberData.message + "</b</p>"
        emailController.sendwithoutcc(memberData.email, "ashokraj.kp@otomeyt.ai", "Message Request", mailBody)
        res.redirect("/admin/viewads")
    },
    
    logout : function(req, res) {
        req.session.destroy(function (err) {
            console.log("logged out : admin ")
        })
        res.render("admin_login", { title: "Admin Login Page" })
    },          





}

module.exports = controller