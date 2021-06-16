// const app = require('express')();
// const cors  =  require('cors');
const server = require('http').createServer();


// app.use(cors());

const io = require('socket.io')(server, {
    transport:['websocket'],
    cors: {
        origin:['http://localhost:8080','https://diplom.westeurope.cloudapp.azure.com'],
        methods: ["GET", "POST"]
    }
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(PORT));

io.on('connection', client => {

    console.log(321);

    client.on('join', confirenceId => {

        client.join(confirenceId);
        console.log(1);
    })

    client.on('stream', (confirenceId, data) => {
        io.in(confirenceId).except(client.id).emit('stream', data);
        console.log(2);
    })

    client.on('endStream', confirenceId => {
        setTimeout(() => {
            io.in(confirenceId).except(client.id).emit('endStream');
        }, 1000);

    });

    client.on('setStreamer', (confirenceId, login) => {
        io.in(confirenceId).except(client.id).emit('setStreamer', login);
    })

    client.on('takeAwayStreamingRight', confirenceId => {
        io.in(confirenceId).except(client.id).emit('takeAwayStreamingRight');
    })

    client.on('returnStreamingRight', confirenceId => {
        io.to(confirenceId).emit('returnStreamingRight');
    })

    client.on('voiceStream', (confirenceId, data, login) => {
        io.in(confirenceId).except(client.id).emit('voiceStream', data, login);
    })

    client.on('stopVoiceStream', (confirenceId, login) => {
        io.in(confirenceId).except(client.id).emit('stopVoiceStream', login);
    })

});


