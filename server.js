var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

var dbUrl = ''


app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req, res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err){
            sendStatus(500)
        }else{
            io.emit('message', req.body)
            res.sendStatus(200)
        }
    })

})

io.on('connection', (socket)=>{
    console.log("a user connected")
})

mongoose.connect(dbUrl,{ useNewUrlParser: true }, (err)=>{
    console.log('mongo db connection', err)
})
var server = http.listen(3000, ()=>{
    console.log('server is listening on port', server.address().port)
})
