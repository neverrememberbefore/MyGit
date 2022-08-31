const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const GenId = require("../utils/SnowFlake")

var db = new sqlite3.Database(path.join(__dirname,"blog.sqlite3"))
//暂定只有1台机器，通过修改机器码来判定几台机子
const genid = new GenId({WorkerId:1})

db.async = {}

db.async.all = (sql,parms) => {
    return new Promise((resolve,reject)=>{
        db.all(sql,parms,(err,rows)=>{
            resolve({err,rows})
        })

    })
}

db.async.run = (sql,parms) => {
    return new Promise((resolve,reject)=>{
        db.run(sql,parms,(err,rows)=>{
            resolve({err,rows})
        })

    })
}



module.exports = {db,genid}