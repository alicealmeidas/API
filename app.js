const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url")
let sql;
const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE,(err) => {
    if (err) return console.error(err);

});
app.use(bodyParser.json());
app.post('/quote',(req,res)=>{
    try {
        const {movie, quote, character} = req.body;
        sql = "INSERT INTO quote(movie, quote, character) VALUES(?,?,?)"
        db.run(sql, [movie,quote,character], (err)=>{
            if(err) return res.json({status:300,sucess:false,error:err})
            console.log('succesful input', movie,quote,character);
        });
        res.json({
            status: 200,
            success: true,
        })
    }catch (error){
        return res.json({
            status: 400,
            sucess: false,
        });
    }
});
//get request
app.get("/quote",(req,res)=>{
    sql= "SELECT * FROM quote";
    try {
        const queryObject = url.parse(req.url, true).query; //query parameters
        if(queryObject.field && queryObject.type) 
            sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
        db.all(sql,[],(err,rows)=>{
            if (err) return res.json({status:300,sucess:false,error:err})

            if(rows.length<1) 
            return res.json({status:300,sucess:false,error:"No match"})
            return res.json({status:200, data: rows, sucess: true})
        })
            
    } catch(error){
        return res.json({
            status: 400,
            sucess: false,
        }); 
    }
})
app.listen(3000)