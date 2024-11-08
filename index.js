const express= require('express')
const path= require('path')
const cors= require('cors')
const {open}= require('sqlite')
const sqlite3 = require('sqlite3')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')

const app= express()
app.use(express.json())
app.use(cors())

const dbPath= path.join(__dirname, 'loans.db')
let db = null

const initializeServer= async()=>{
    try{
        db= await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3000, ()=>{
            console.log('Server is running at http://localhost:3000/')
        })
    }catch(e){
        console.log(`DB Error : ${e.message}`)
        process.exit(1)
    }
}
initializeServer()

// Admin login
app.get('/api/admin', async (req, res)=>{
    const getSql= `
    Select * from admin;
    `
    const admin= await db.all(getSql)
    res.send(admin) 
})

app.post('/api/adminlogin', async (req, res)=>{
    const {adminusername, adminpassword}= req.body 
    const usersql= `select * from admin where username = '${adminusername}';`
    const checkPass= `select * from admin where password = '${adminpassword}';`
    const user= await db.get(usersql)
    const chepass= await db.get(checkPass)
    if (user == undefined){
        res.status(400)
        res.send('Username is invalid')
    }else if (chepass == undefined){
        res.send('Wrong Password')
    }else{
        const payload = {username: adminusername}
        const jwtToken = jwt.sign(payload, 'werfsgrrdcvbghg')
        res.send({jwtToken})
    }

})

//User register
