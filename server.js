'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books',
    { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    name:String,
    description:String,
    status: String
})

const userSchema = new mongoose.Schema({
    email: String,
    books: [bookSchema] //
})

const userModel = mongoose.model('user', userSchema);
function seedKittenCollection() {
    let user1=new userModel({
    email:'bahaaqasem20@gmail.com' ,
    books:[
        {
            name: 'javascript',
            description: 'blah blah',
            status:'hello'
        },
        {
            name: 'css',
            description: 'blah blah',
            status:'hello'
        },
        {
            name: 'html',
            description: 'blah blah',
            status:'hello'
        },
    ]
    });
    let user2=new userModel({
        email:'vittosc1997@gmail.com' ,
        books:[
            {
                name: 'php',
                description: 'blah blah',
                status:'hello'
            },
            {
                name: 'javascript',
                description: 'blah blah',
                status:'hello'
            },
            {
                name: 'html',
                description: 'blah blah',
                status:'hello'
            },
        ]
        })
        user1.save();
        user2.save();
}
//seedKittenCollection();
app.get('/book',(req,res)=>{
 let email= req.query.email;
 //email.replace('%40','@');
 console.log(email);
 userModel.find({email:email},function(err,userData){
    if(err) {
       res.send('something went wrong!');
    } 
    
    else {
        res.send(userData[0].books)
    }
})
})

app.post('/Addbook',handleAddBook);


function handleAddBook(req,res){
    const {name,description,status,email} = req.body;
    //email.replace('%40','@');
    console.log(email);
    userModel.find({email:email},function(err,userData){
    if(!err){
        userData[0].books.push({
            name:name,
            description:description,
            status:status
        })
        
         userData[0].save();
        res.send(userData[0].books);
    }
    else{
        res.send(`${err} something wrong!`);
    }
    });
}



app.get('/', (req,res) => {
    res.send('alive');
});
app.listen(PORT, () => {
    console.log('listening');
})