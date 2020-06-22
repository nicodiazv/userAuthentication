const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

const users = []

app.use(express.json())
app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 = bcrypt.genSalt(10)

        const user = {
            name: req.body.name,
            password: hashedPassword
        }

        users.push(user)
        res.status(201).send()
    } catch (error) {
        res.status(500).send()
    }

})


app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name == req.body.name)
    if (user == null) return res.status(400).send("cannot find user")
    try {
        if(! await bcrypt.compare(req.body.password, user.password)) res.send("not allowed")
        
        res.send("success")
         
    } catch (error) {
        res.status(500).send()
    }

})

app.listen(3000)