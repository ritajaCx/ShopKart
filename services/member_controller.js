const dbcontroller = require('./member_db')
const emailController = require('./sendmail')
const formidable = require("formidable")
const fs = require('fs')
const path = require('path')

dbcontroller.dbcontroller.connection()  


var userdata;
var loginUser = userdata;

var controller = {


    home : function(req,res){

        if(req.session.loginMemId){

            res.render("member_index", {title : "Member Index Page"})
        }
        else{

            res.render("member_login",{title : "Member Login Page"})
        }

    },

    login : function(req,res){
        res.render("member_login", {title: "Member Login Page", data: null})
    },
    
    loginverify : async function(req,res){
     
        
            var email = req.body.email
            var password = req.body.password
            console.log("Session Login : Member")
            console.log("Email : ", email)
            console.log("Password : ", password)
          
            var userdata = await dbcontroller.loginStaff(email, password)
            console.log("member Data : ", userdata)
            loginUser = userdata
            req.session.loginMemId = userdata._id.toString()

            if (userdata != null) {

                //req.session.loginMemId = userdata._id
                res.render("member_index", { title: "Member Index Page", userdata: userdata })
            }
            else {
                
                res.render("member_login", { title: "Member Login Page" })
            }
    },

    uploadView : function(req, res){
        if( req.session.loginMemId )
        {
            res.render("member_newad", {title : "Form with upload"})
        }
        else
        {
            res.render("member_login", {title : "Member Login Page"})
        }
    },

    uploadAction : async function(req, res){

        var id2 = req.session.loginMemId 
        var form = new formidable.IncomingForm();
        dbcontroller.dbcontroller.createad(req, form, id2) 
        console.log("1 ad posted successfully !")
        
      // res.redirect("/member/viewads")
        res.render("member_index", {title: "member home page", data: userdata})
    },


    
    forgotView : function(req, res){
        res.render("member_fgtpassword", {title : "Staff Forgot Password Page"})
    },

    sendPassword : async function(req, res){
        var email = req.body.email
        var user = await dbcontroller.getUserByEmail(email)
        if( user == null )
        {
            res.send("<body style='background-color:gray;color:white'><h1><center>Entered Email is Not Registered</center></h1></body>")
        }
        else{
            var password = user.password
          

            //send this email
          
            emailController.send(email, "ashokraj.kp@otomeyt.ai",  "Password Recovery",  "Your password is : " + "<b>" + password + "</b>")
            res.render("member_login", {title : "Member Login Page"})
           
        }
    },

    //new registration//
    newregister : function(req,res){
        res.render("member_register", {title: "Member Registration Page"})
    },

    register : function(req,res){

        var name = req.body.name      //add ad category ?
        var email = req.body.email
        var password = req.body.password
        var govtid = req.body.govtid
        var location = req.body.location
        var address = req.body.address
        var pincode = req.body.pincode
        var contact = req.body.contact

        var newreg={
            "name" : name,
            "email" : email,
            "password" : password,
            "govtid" : govtid,
            "location" : location,
            "address" : address,
            "pincode" : pincode,
            "contact" : contact
        }

        console.log("New member Registered : " ,name)
        dbcontroller.dbcontroller.registration(newreg, email)
        res.render("member_login",{title : "Member Login Page"})

    },


    
    viewAds : function(req, res,id){
        var id = req.session.loginMemId
        dbcontroller.dbcontroller.viewads(res, id)
    },


    viewAdDet: async function (req,res, id) {
        

        var id = req.params.id
        var ad = await dbcontroller.dbcontroller.getAdById(id)
        //ad-view.ejs
        //form the url of the image
        if( ad != null )
        {
            var imageUrl = "/media/" + ad._id + "." + ad.image
            console.log("Image url : ", imageUrl)
            res.render("member_adview", {'title' : "Ad full view", 'adData' : ad, 'imageUrl' : imageUrl})
        }
        else
        {
            res.render("member_allads", {title : "Staff Home Page"})
        }
    },   

  
    deleteAds : function (req, res,id) {
     
            var id = req.params.id
            dbcontroller.dbcontroller.deleteads(id)
            res.redirect("/member/viewads/"+loginUser._id.toString())
            
    },

    update : function(req,res){
        res.render("member_updateind", {title:"update account"})
    },

    updateProfileview : function(req,res,id){
        var id= req.session.loginMemId
        dbcontroller.dbcontroller.updateprofileview(res, id)
    },

    updateProfile : async function(req,res){
        var prodata ={
            id : req.body.id,
            name : req.body.name,
            email : req.body.email,
            govtid : req.body.govtid,
            location : req.body.location,
            address : req.body.address,
            pincode :req.body.pincode,
            contact :req.body.contact
        }

        dbcontroller.dbcontroller.updateprofile(prodata)
        await res.redirect("/member/")
    },
    
    updatePasswordview : function(req,res,id){
        var id= req.session.loginMemId
        dbcontroller.dbcontroller.updatepasswordview(res, id)
    },

    updatePassword : async function(req,res){
        var prodata2 ={
            id : req.body.id,
            password : req.body.password
        }

        dbcontroller.dbcontroller.updatepassword(prodata2)
        await res.redirect("/member/")
    },


    updateAdview : function(req,res,id){
        var id = req.params.id
        // await dbcontroller.dbcontroller.getAdById(id)
        dbcontroller.dbcontroller.updateadview(id,res)
    },

    updateAd: async function(req,res){
       

        var prodata3 ={
            id : req.body.id,
            title : req.body.title,
            description : req.body.description,
            price : req.body.price,
            image : req.body.adimage 

        }
        dbcontroller.dbcontroller.updatead(prodata3)
        await res.redirect("/member/viewads/"+loginUser._id.toString())

      
    },

    deleteAll : function(req,res){
        var id= req.session.loginMemId
        dbcontroller.dbcontroller.deleteall(res,id)  
    },


    deleteAccount : function(req,res){
        var id = req.session.loginMemId
        dbcontroller.dbcontroller.deactivateaccount(res, id)     
    },

    logout : function(req, res) {
        req.session.destroy(function (err) {
            console.log("logged out : Member ")
        })
        res.render("member_login", { title: "Member Login Page" })
    },          




  


    
}

module.exports = controller