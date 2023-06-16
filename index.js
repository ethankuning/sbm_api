const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/runs", async(req, res) => {
    try {
        const getBooks = await pool.query('SELECT * FROM "Data"');

        res.json(getBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/runs/:sid", async(req, res) => {
    try {
        const {sid} = req.params;
        const getBooks = await pool.query('SELECT * FROM "Data" WHERE run = $1', [sid]);

        res.json(getBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/runs", async(req, res) => {
    try {
        const {temperature, humidity, distance, gyro, run} = req.body;
        const postBooks = await pool.query('INSERT INTO "Data"(temperature, humidity, distance, gyro, run) VALUES($1, $2, $3, $4, $5) RETURNING *', [temperature, humidity, distance, gyro, run]);

        res.json(postBooks);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/runs/:sid", async(req, res) => {
    try {
        const {id} = req.params;
        const delBooks = await pool.query('DELETE FROM "Data" WHERE run = $1 RETURNING *', [id]);

        res.json(delBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/runs", async(req, res) => {
    try {
        const {id} = req.params;
        const delBooks = await pool.query('TRUNCATE "Data" RETURNING *');

        res.json(delBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("server started");
});