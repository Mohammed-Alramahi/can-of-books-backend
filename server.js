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
    name: String,
    description: String,
    status: String
})

const userSchema = new mongoose.Schema({
    email: String,
    books: [bookSchema] //
})

const userModel = mongoose.model('user', userSchema);
function seedKittenCollection() {
    let user1 = new userModel({
        email: 'bahaaqasem20@gmail.com',
        books: [
            {
                name: 'javascript',
                description: 'blah blah',
                status: 'hello'
            },
            {
                name: 'css',
                description: 'blah blah',
                status: 'hello'
            },
            {
                name: 'html',
                description: 'blah blah',
                status: 'hello'
            },
        ]
    });
    let user2 = new userModel({
        email: 'vittosc1997@gmail.com',
        books: [
            {
                name: 'php',
                description: 'blah blah',
                status: 'hello'
            },
            {
                name: 'javascript',
                description: 'blah blah',
                status: 'hello'
            },
            {
                name: 'html',
                description: 'blah blah',
                status: 'hello'
            },
        ]
    })
    user1.save();
    user2.save();
}
// seedKittenCollection();


app.get('/book', (req, res) => {
    let email = req.query.email;
    email.replace('%40', '@');
    console.log(email);
    userModel.find({ email: email }, (err, userData) => {


        if (err) {
            res.send('something went wrong!');
        }

        else {
            console.log(userData[0].books)
            res.send(userData[0].books)
        }
        // userData[0].save();

    })
})
app.put('updateBook/:index',handleUpdateBook);
app.post('/Addbook', handleAddBook);
app.delete('/deletebook/:index', handleDeleteBook);
function handleDeleteBook(req, res) {
    const email = req.query.email;
    email.replace('%40', '@');
    const index = parseInt(req.params.index);
    console.log(email);
    userModel.find({ email: email }, function (err, userData) {

        if (!err) {
            const newBooksArr = userData[0].books.filter((book, i) => {
                if (i != index) {
                    return book;
                }
            });

            userData[0].books = newBooksArr;
            userData[0].save();
            res.send(userData[0].books);
        }
        else {
            res.send("oops");
        }
    })

}
function handleUpdateBook(req,res){
    const {email,name,description,status,image} = req.query;
    email.replace('%40', '@');
    const index = parseInt(req.params.index);
    console.log(email);
    userModel.findOne({ email: email }, function (err, userData) {
        if (!err) {
            const newBooksArr = userData.books.filter((book, i) => {
                if (i == index) {
                    book={
                    name:name,
                    description:description,
                    status:status,
                    image:image
                    }
                }
            });

            userData.books = newBooksArr;
            console.log(newBooksArr);
            userData.save();
            res.send(userData.books);
        }
        else {
            res.send("oops");
        }
    })
}

function handleAddBook(req, res) {
    const { name, description, status, email } = req.body;
    email.replace('%40', '@');
    console.log(email);
    userModel.find({ email: email }, function (err, userData) {
        if (!err) {
            userData[0].books.push({
                name: name,
                description: description,
                status: status
            })

            userData[0].save();
            res.send(userData[0].books);
        }
        else {
            res.send(`${err} something wrong!`);
        }
    });
}

app.get('/', (req, res) => {
    res.send('alive');
});
app.listen(PORT, () => {
    console.log('listening');
})