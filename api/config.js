// config.js
import mysql from "mysql";

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "virtualtalk",
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected");
    }
});

export default con;
