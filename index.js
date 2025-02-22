const express = require('express');
const cors = require('cors');
const authentication = require('./middlewares/authenticate');
const userRoutes = require('./routes/user.routes');
const competitionRoutes = require('./routes/competition.routes');
const manageRoutes = require('./routes/manage.routes');
const cookieParser = require("cookie-parser");
const http = require('http');

const app = express();
const server = http.createServer(app);


app.use(cors({
    // origin: ['https://frontend-one-gamma-23.vercel.app'], 
    origin: ['https://odyssey.procom.com.pk','https://frontend-one-gamma-23.vercel.app','http://localhost:5173'], 
    credentials: true, 
}));

// const socket = require('./socket'); 
const PORT = process.env.PORT || 3000;


// const io = socket.init(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(authentication);

//app.use(authentication);


app.use('/api',userRoutes);
app.use('/api',competitionRoutes);
app.use('/api',manageRoutes);

app.get('/api', (req, res) => {
    res.send('Hunt Data with data dungeon!');
});

server.listen(PORT, () => {
    
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
});


module.exports = app;
