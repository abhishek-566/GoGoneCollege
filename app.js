const express = require("express");
const path = require("path");
const app = express();
const port = 80;

var mongoose = require("mongoose");
const { json } = require("body-parser");
mongoose.connect('mongodb://localhost/form', { useNewUrlParser: true, useUnifiedTopology: true });

const formSchema = new mongoose.Schema({
    name: String,
    age: String,
    gender: String,
    more: String,
});
const form = mongoose.model('form', formSchema);

app.use("/static", express.static("static"));
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    res.status(200).render("site.ejs");
})
app.get("/Colleges", (req, res) => {
    res.status(200).render("site.ejs");
})
app.get("/Exams", (req, res) => {
    res.status(200).render("Exams.pug");
})
app.get("/News", (req, res) => {
    res.status(200).render("site.ejs");
})
// app.get("/Courses",(req,res)=>{
//     res.status(200).render("site.pug");
// })

app.get("/contact", (req, res) => {
    res.status(200).render("contact.pug");
})
app.post("/contact", (req, res) => {
    let submitted = { contain: "your form has been submited!! We will contact you soon..." };
    var mydata = new form(req.body);
    mydata.save().then(() => {
        res.status(200).render("contact.pug", submitted);
    }).catch(() => {
        res.status(400).render("contact.pug")
    })

})

app.post("/", (req, res) => {
    var search=(req.body.search);
    console.log(search);
    form.find({name:new RegExp(search)},{'name':1}, {
        _id: 0,
        __v: 0
    }, function (err, data) {
        res.json(data);
        console.log(data);
    }).limit(10);
})
// app.get("/search", function (req, res, next) {
//     var q = req.query.q;
//     // //    full text searching using $text
//     // forms.find({
//     //     $text: {
//     //         $search: q
//     //     }
//     // }, {
//     //     _id: 0,
//     //     __v: 0
//     // }, function (err, data) {
//     //     res.json(data);
//     // });
//     //    partial text searching using $text
    // form.find({
    //     name: {
    //         $regex:new RegExp(q)
    //     }
    // }, {
    //     _id: 0,
    //     __v: 0
    // }, function (err, data) {
    //     res.json(data);
    // }).limit(10);

//  })

app.get('/autocomplete/', function(req, res, next) {

    var regex= new RegExp(req.query["term"],'i');
   
    var employeeFilter =form.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    employeeFilter.exec(function(err,data){
    // console.log(data);
  
  var result=[];
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(user=>{
         let obj={
           id: user._id,
           label: user.name,
           age:user.age,
         };
        //  console.log(obj);
         result.push(obj);
       });
  
     }
   
     res.jsonp(result);
  }
  
    });
  
  });

app.listen(port, () => {
    console.log(`the application started successfully on port ${port}`)
})