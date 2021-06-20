const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require('uniqid');
const app = express();
const PORT = process.env.PORT || 8080;

//settings for the server.//
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

//routes for the html pages.//
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));


//route to get the database of saved notes.//
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
});

//lets the user post new notes and save to the database.//
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    newNote.id = uniqid();
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        const parseData = JSON.parse(data);
        console.log(JSON.parse(data));
        parseData.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(parseData), err => {
            if (err) throw err;
            res.json(parseData)
        })
    })
});

// Deletes note from database by its unique ID
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const noteArr = JSON.parse(data).filter((note) => note.id !== req.params.id);
        fs.writeFile("./db/db.json", JSON.stringify(noteArr), err => {
            if (err) throw err;
            res.json(data)
        });
    })
});


//lets the user know that the server is working and listening on the specific port.//
app.listen(PORT, () => console.log(`Application is listening on PORT${PORT}`));