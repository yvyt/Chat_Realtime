var createError = require('http-errors');
var express = require('express');
var path = require('path');
var authRouter = require("./routers/authRoute")
var userRouter = require("./routers/userRoute")
var indexRouter = require('./routers/index');
var chatRouter = require("./routers/chatRoute")
var mongoose = require("mongoose")
var app = express();
var { engine } = require("express-handlebars")
const httpServer = require('http').createServer(app);
var io = require("socket.io")(httpServer);
var cookieParser = require('cookie-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const api = require("./api/user")
    //Loads the handlebars module
    //Sets our app to use the handlebars engine
app.engine('handlebars', engine({
    layoutsDir: __dirname + '/views/layouts',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
// error handler
mongoose.connect("mongodb://127.0.0.1:27017/Messenger", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", () => console.log("error in connecting database"));
db.on("open", () => console.log("Connected to Database"));

io.on("connection", socket => {
    console.log("connection " + socket.id)
    socket.on("client-login", function(data) {
        io.sockets.emit("user-online", data)
    })
    socket.on("user-send-message", function(data) {
        console.log(data)
        socket.broadcast.emit("server-send-message", data)
    })
    socket.on("user-stop-typing", function(data) {
        socket.broadcast.emit("server-stop-typing", data)
    })
    socket.on("send-success", (data) => {
        io.sockets.emit("show-mess", { us: data.us, content: data.content, contact: data.contact, id: data.id })
    })
    socket.on("readMessage", (data) => {
        io.sockets.emit("read-success", data)
    })
    socket.on("update-read", (data) => {
        io.sockets.emit("update-read-server", data)
    })
    socket.on("update-unseen", (data) => {
        socket.broadcast.emit("server-update", data)

    })
    socket.on("user-logout", (data) => {
        io.sockets.emit("users", data)
    })
    socket.on("remove-chat", (data) => {
        io.sockets.emit("display-remove", data)
    })
})
app.use(function(req, res, next) {
    next(createError(404));
});
const server = httpServer.listen(3000, () => {
    console.log(`Server is running at port ${server.address().port}`);
});