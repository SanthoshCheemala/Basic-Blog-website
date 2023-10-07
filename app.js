const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var defaultItems = []

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/BlogDB")
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  }); 

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const BlogSchema = new mongoose.Schema({
  head: String,
  content: String
});

const Blog = mongoose.model('Blog', BlogSchema);
const Blog1 = new Blog({
  head: "This project is about Node.js",
  content: "..."
});

const Blog2 = new Blog({
  head: "This project is about MongoDB",
  content: "..."
});

const Blog3 = new Blog({
  head: "This project is about Express.js",
  content: "..."
});

 defaultItems = [Blog1, Blog2, Blog3];

app.get('/', (req, res) => {
  Blog.find()
  .then((founditems)=>{
    res.render('main',{addlist:founditems})
  })
  .catch((err)=>{
    console.log(err);
  })
});

app.get('/home', (req, res) => {
  res.render('login');
});

app.post('/', (req, res) => {
  res.render('login');
});
let email = ""
let password = ""
app.get('/about',(req,res)=>{
    Blog.find()
  .then((founditems)=>{
    if(founditems.length === 0){
      Blog.insertMany(defaultItems)
  .then(() => {
    console.log("Successfully inserted");
  })
  .catch((err) => {
    console.log(err); 
  })
  res.redirect('/about')
} else {
  res.render('about',{addlist:founditems})
}
  })
})
app.post('/about', (req, res) => {
   email = req.body.email;
   password = req.body.password;

  if (email === "sr65453449@gmail.com" && password === "qwerty12345") {
    res.redirect('/about')
  } else {
    res.render('try');
  }
});

app.post('/tryagain', (req, res) => {
  res.render('login');
});

app.post('/edit', (req, res) => {
  const deletebtn = req.body.deletebtn;
  const addbtn = req.body.add;
  const editbtn = req.body.edittext
 if(addbtn === "addnew"){
    res.render('create')
  } else {
    Blog.find()
    .then((founditems) => {
      founditems.forEach((item) => {
        if (item._id == deletebtn) {
          Blog.deleteOne({ _id: deletebtn })
            .then(() => {
              console.log("successfully deleted");
              res.redirect('/about'); 
            })
            .catch((err) => {
              console.log(err);
            });
         } else if(item._id == editbtn){
            res.render('edit',{list:item})
         } 
      });
    });
  
  }
});
app.post('/create', (req, res) => {
  const create = req.body.create
  const Hhead = req.body.head;
  const Hcontent = req.body.content;
  const back = req.body.back
  if(create === "crt"){
    console.log(Hcontent + Hhead + create)
    const Blog4 = new Blog({
      head:Hhead,
      content:Hcontent
    })
    Blog.insertMany([Blog4])
    .then(()=>{
      console.log("succesfully inserted Blog4")
    })
    .catch((err)=>{
      console.log(err)
    })
    res.redirect('/about')
  } else if(back === "backtoabout"){
    res.redirect('/about')
  }

});
app.post('/update',(req,res)=>{
  const update = req.body.update
  const deleteb = req.body.delete;
  const uhead = req.body.head
  const ucontent = req.body.content
  const back = req.body.back;
  if(back === "backtoabout")
  {
    res.redirect('/about')
  } else {

  
  Blog.find()
  .then((founditems)=>{
    founditems.forEach((item)=>{
      if(item._id == deleteb){
        Blog.deleteOne({ _id: deleteb })
        .then(() => {
          console.log("successfully deleted");
          res.redirect('/about'); 
        })
        .catch((err) => {
          console.log(err);
        });
      } else if(update == item._id){
        Blog.updateMany({ _id: update }, { $set: { head: uhead, content: ucontent }})
        .then(() => {
          console.log("Successfully updated");
          res.redirect('/about');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/about');
        });
      
      }
    })
  })

}
})
app.post('/logout', (req, res) => {
  res.redirect('/');
});
app.get('/homee',(req,res)=>{
  res.redirect('/')
})

app.listen(3001, () => {
  console.log('Local host is running on port 3001');
}); 
