//import modules
const express = require('express')
const session = require('express-session')
const bp = require('body-parser')
var port = process.env.PORT || 7089

var app = express() //main server
var admin = express() //subserver 1 : admin
var member = express() //subserver 2: member
var guest = express() //subserver 2: guest

//mount body-parser
app.use(bp.urlencoded ({extended : true})) 
admin.use(bp.urlencoded ({extended : true})) 
member.use(bp.urlencoded ({extended : true})) 
guest.use(bp.urlencoded ({extended : true})) 


//mount ejs
app.set("view engine", "ejs")
admin.set("view engine", "ejs")
member.set("view engine", "ejs")
guest.set("view engine", "ejs")

//mount session
admin.use(session({
    secret : "admin99",
    resave : true,
    saveUninitialized : true
}))
member.use(session({
    secret : "member99",
    resave : true,
    saveUninitialized : true
}))
guest.use(session({
    secret : "guest99",
    resave : true,
    saveUninitialized : true
}))

//mount the subserver to the main server
app.use("/admin", admin)
app.use("/member", member)
app.use("/guest", guest)

app.use(express.static('public')); //monting the static contents
member.use(express.static('public'));

//routes mapping
var adminRoutes = require('./services/admin_routes')
var memberRoutes = require('./services/member_routes')
var guestRoutes = require('./services/guest_routes')

adminRoutes(admin)
memberRoutes(member)
guestRoutes(guest)


app.listen(port, ()=>{console.log("Application running at ", port)})
