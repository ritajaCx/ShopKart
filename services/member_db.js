const mongodb = require('mongodb')
const mongoclient = require('mongodb').MongoClient
const formidable = require('formidable')
const fs = require('fs')
var url = "mongodb://127.0.0.1:27017"

var db;


//req.session.loginMemId=true;



function loginStaff (email, password){
    var collection = db.collection("member")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userdata =  collection.findOne(filter)  
    return userdata;   
}

function getUserByEmail(email){
    var collection = db.collection("member")
    var filter = {
        "email" : email
    }
    var userdata = collection.findOne(filter)
    return userdata;
}





var dbcontroller={

    connection : function(){

        mongoclient.connect(url,function(err, database){
            if(err){
                console.log("error in db connection", err)
                return
            }
            db = database.db("adproject")  
            console.log("db connected : member server")
        })
    },

    newad : function(id, res){
        res.render("member_newad", {title :"create new Ad"})},
    

    createad : function(req,form, data){      //(data)

        var collection = db.collection("ad")
        console.log("inside ad insertion")

        form.parse(req,function(err, fields, files){

            var oldPath = files.adimage.filepath;
            var extension = files.adimage.originalFilename.split('.').pop();
            

            //add text to db
            var title = fields.title
            var description = fields.description
            var price = fields.price
            var timestamp = Date.now();
            var currdate =  new Date();

            console.log("name : ", title)
            console.log("description : ", description)

            
            var adData = {
            'memberId' : req.session.loginMemId,
            "title" :title,
            "description" : description,
            "price" :price,
            "image" : extension,
            "timestamp" : timestamp,
            "createdDateTime" : currdate
            }
            collection.insertOne(adData)
            console.log("inside ad insertion")
            var adId = adData._id
            console.log(adId)

            var newFileName = "./public/media/" + adId + "." +extension;
            fs.readFile(oldPath, function(err, data){
                if(err)
                {
                    console.log("Error in upload : ", err)
                    return
                }
                //write
                fs.writeFile(newFileName, data, function(err){
                    if(err)
                    {
                        console.log("Error in upload2 : ", err)
                        return   
                    }
                })
            })

            
              
        })
         
    },

    viewads: function (res, id) {

        //var newid = mongodb.adData.memberId
        var collection = db.collection("ad")
        var filter={
            'memberId' : id 
        }
        collection.find(filter).sort({timestamp :-1}).toArray(function (err, result) {
            if (err) {
                console.log("Error in viewing member ads", err)
                return
            }
          res.render("member_allads", { title: "view all ads", adData: result })
        })
        //res.render("member_allads", { title: "view all ads" , data : adData})
    },   
    
    getAdById : function(id)
{
    var collection = db.collection("ad")
    var filter = {
        '_id' : mongodb.ObjectId(id)
    }
    var ad = collection.findOne(filter);
    return ad;
},
   

   
    registration : function (data, res){

        var collection = db.collection("member")
        // var email = userdata.email
        // var filter = {
        //     "email" : email
        // }
        // collection.find(filter, function(err, result){
        //     if (err)
        //     {console.log(err) ;
        //         return
        //     }

        //     if(result.length >0)
        //     {res.send("<body style='background-color:gray;color:white'><h1><center>Entered Email Address is Already Registered !</center></h1></body>")}

        //     else{
                collection.insertOne(data, function(err, result){
                    if(err){
                        console.log("error in  registration", err)
                        return
                    }
                    console.log("1 New member Registered to AdManager")
                  
                })
          // }
       // })
        
       
    },

    updateprofileview : function(res,id){
        var collection= db.collection("member")
      //  console.log(id)
        var filter ={
            "_id" : mongodb.ObjectId(id)
        }

        var prodata = null
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("error in update action prof", err)
                return
            }
            result.forEach(element =>{
                prodata = element
            })
            res.render("member_updateprof", {title :"Update Profile Data", data: prodata})
        })
    },

    updateprofile : function( data, id){

        var selid= data.id
        var collection = db.collection("member")
        var filter ={
            "_id" : mongodb.ObjectId(selid)

        }
        var jsondata ={
            $set :{
            name : data.name,
            email : data.email,
            govtid : data.govtid,
            location : data.location,
            address : data.address,
            pincode : data.pincode,
            contact : data.contact
            }
        }
        collection.updateMany(filter, jsondata,function(err,result){
            if(err){
                console.log("error in updating profile", err)
                return
            }
            console.log("Member Profile updated Successfully !")
        })
    },

    updatepasswordview : function(res,id){
        var collection= db.collection("member")
      //  console.log(id)
        var filter ={
            "_id" : mongodb.ObjectId(id)
        }

        var prodata2 = null
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("error in update action pass", err)
                return
            }
            result.forEach(element =>{
                prodata2 = element
            })
            res.render("member_updatepass", {title :"Update Password", data: prodata2})
        })
    },

    updatepassword : function( data, id){

        var selid= data.id
        var collection = db.collection("member")
        var filter ={
            "_id" : mongodb.ObjectId(selid)

        }
        var jsondata2 ={
            $set :{
            password : data.password
            }
        }
        collection.updateMany(filter, jsondata2,function(err,result){
            if(err){
                console.log("error in updating password", err)
                return
            }
            console.log("Member Password updated Successfully !")
        })
    },

    updateadview : function(id,res){
        var collection= db.collection("ad")
        var upidad = mongodb.ObjectId(id)
      //  console.log(id)
        var filter ={
            "_id" : upidad
        }

        var prodata3 = null
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("error in update action ad", err)
                return
            }
            result.forEach(element =>{
                prodata3 = element
            })
            res.render("member_updatead", {title :"Update Ad", data: prodata3})
        })
    },


    updatead : function(data, res){
        var selid= data.id
        var collection = db.collection("ad")
        var filter ={
            "_id" : mongodb.ObjectId(selid)

        }
        var jsondata3 ={
            $set :{
            title: data.title,
            description : data.description,
            price : data.price,

            }
        }
        collection.updateMany(filter, jsondata3,function(err,result){
            if(err){
                console.log("error in updating password", err)
                return
            }
            console.log("Ad updated Successfully with id ", selid)
        })
    },

    reuploadimgview: function (id, res) {
        var collection = db.collection("ad")
        var newid = mongodb.ObjectId(id)
        var filter = {
            "_id": newid
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log(err)
                return
            }
            result.forEach(element => {
                adData = element
            })
            res.render("member_updateimg", { title: "view", data: adData })
        })
    },

    reuploadadimg : function(req, form, loginUser) {
       
          
        form.parse(req, function (err, fields, files) {
         
            var collection = db.collection("ad")
            var selId = fields.id
            var filter = {
                "_id": mongodb.ObjectId(selId)
            }
           // console.log(selectedId)
            var oldPath = files.adimage.filepath; //temp location 
            var extension = files.adimage.originalFilename.split('.').pop()
            console.log(extension)
            var adData = {
                $set: {
                    'image': extension
                }
            }
            collection.updateMany(filter, adData, function (err, result) {
                if (err) {
                    console.log("err in img update", err)
                    return
                }
            })
            var adId = fields.id
            var newFileNameName = "./public/media/" + adId + "." + extension;
            fs.readFile(oldPath, function (err, data) {
                if (err) {
                    console.log("Error in upload : ", err)
                    return
                }
                //write
                fs.writeFile(newFileNameName, data, function (err) {
                    if (err) {
                        console.log("Error in upload : ", err)
                        return
                    }
                })
            })
    
        })
    },
    

    deactivateaccount: function (res, id) {
        var newId = mongodb.ObjectId(id)
        var collection = db.collection("member")
        var adcollection = db.collection("ad")
        var filter = {
            "_id": newId
        }
        var filter2 = {
            memberId: id
        }
        collection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Error in delete ", err)
                return
            }
            console.log("member deleted")
            adcollection.deleteMany(filter2, function (err, result) {
                if (err) {
                    console.log("Error in delete ", err)
                    return
                }
                console.log("all ads of member got deleted")
            })
        })
        res.redirect("/member/login")

    },
    deleteall : function(res,id){
        var collection = db.collection("ad")
        var filter = {
            "memberId": id
        }

        collection.deleteMany(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("all ads deleted with member id : ", id)

        })
        res.redirect("/member/viewads/" + id)

    }
    ,



    deleteads : function(id, res){
        var delid = mongodb.ObjectId(id)
        var collection = db.collection("ad")
        var filter = {
             "_id" : delid
    
          }
        collection.deleteOne(filter, function(err, data){
        if(err){
            console.log("error in deleting ads", err)
            return
        }
        console.log("data deleted successfully for ad with id", delid)
                })

    },
   
    
   
    // 
    //     collection.deleteOne(filter, function(err, result){
    //         if(err){
    //             console.log("error in deleting student details", err)
    //             return
    //         }
    //         console.log("data deleted successfully for student with id", delid)
    //     })
    // },

    
    
    



}

module.exports = {dbcontroller, loginStaff, getUserByEmail}
