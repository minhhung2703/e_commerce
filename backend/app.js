const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors")
const path = require("path")

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use("/", express.static(path.join(__dirname, "./uploads")));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env",
    });
}

// import routes
const user = require("./controller/user")

app.use("api/v2/user", user);

// It's for ErrorHandling
app.use(ErrorHandler)

module.exports = app;