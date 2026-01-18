import dotenv from "dotenv";
import express from "express";
import app from "./app";
import path from "path";
import "./jobs"; // Initialize workers
dotenv.config();

const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
