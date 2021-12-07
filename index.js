const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const BlogPost = require('./models/BlogPost');
const fileUpload = require('express-fileupload');

// dotenv for DB connection string
require('dotenv').config();

app.use(fileUpload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// DB
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
if(!mongoose){
    console.log('Error connecting to DB')
} else {
    console.log('DB connected!!')
}


// routes
app.listen(3000, () => {
    console.log('app listening')
})

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.get('/create', (req, res) =>{
    res.render('create')
})

// single post page
app.get('/post/:id', async (req, res)=>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{
        blogpost
    })
})

// receiving post
app.get('/blogs',async (req,res) =>{
    const blogposts = await BlogPost.find({}).sort({_id: -1}).limit({limit: 10});
    // console.log(blogposts)
    res.render('blogs',{
        blogposts
    })
})

// creating post
app.post('/posts/store', (req, res)=>{
    BlogPost.create(req.body,(error,blogpost)=>{
        res.redirect('/blogs')
    })
})

app.post('/posts/store',async (req,res) =>{    
    let image = req.files.image
    image.mv(path.resolve(__dirname,'public/img',image.name),
        async (error)=>{
            await BlogPost.create({
                ...req.body,
                image:'/img/' + image.name
            })
            res.redirect('/blogs')
        })

})

