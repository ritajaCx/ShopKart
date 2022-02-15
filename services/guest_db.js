const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb+srv://ritaja11:ritaja11@cluster0.smtjr.mongodb.net/adproject"
var db;


var dbcontroller = {
    connection: function () {
        mongoClient.connect(url, function (err, database) {
            if (err) {
                console.log("Err in database server connection")
                return
            }
            db = database.db("adproject")
            console.log("db connected : guest server")
        })
    },

    viewallads: function (res) {
        var collection = db.collection("ad")

        collection.find().sort({ timestamp: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error in viewing all ads", err)
                return
            }
            res.render("guest_allads", { title: "List Of Ads", adData: result })
        })
    },

    viewaddet: function (id, res) {
        var collection = db.collection("ad")
        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var addet = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("error in filtering", err)
                return
            }
            result.forEach(element => {
                addet = element
            })
            var memberid = addet.memberId

            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            memberData=null
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("err")
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("guest_adview", { title: "view all ads", 'addet': addet, 'memberData': memberData })
            })
        })
    },

    contactmember: function (id, res) {

        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }

        membercollection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("error in member contact", err)
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("guest_sendmail", { title: "contact seller", 'memberData': memberData })
        })

    },

}


module.exports = { dbcontroller }
