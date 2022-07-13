const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./router');
const testAPIRouter = require('./testAPI');
const {DEFAULT_USER_TYPE} = require('./utils');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAdminUser,
    setVotingHistory,
    getVotingHistory,
    removeEstimationFromHistory
} = require('./users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);
app.use('/testAPI', testAPIRouter);

io.on('connect', (socket) => {

    socket.on('join', ({ name, type ,room }, callback) => {
        const { error, user } = addUser({ id: socket.id, type, name, room });

        if(error) return callback(error);

        socket.join(user.room);
        const time = new Date();
        console.log(type, '-', user.name, 'joined - ', room, 'time - ', time.toLocaleDateString(), time.toLocaleTimeString());

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`}); // only sender receives
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` }); //all receives except sender

        io.to(user.room).emit('updateUsersData', {users: getUsersInRoom(user.room) });//all receive
        io.to(user.room).emit('setVotingHistory', { history: getVotingHistory(user.room) });
        if (type === DEFAULT_USER_TYPE) {
            const admin = getAdminUser(user.room);
            admin && io.to(admin.id).emit('userJoined', user);//specific user receives only.
        }
        callback();
    });

    socket.on('sendEstimate', (point, callback) => {
        const user = getUser(socket.id);
        const admin = getAdminUser(user.room);
        admin && io.to(admin.id).emit('setEstimateOnCards', { user: user.name, id: socket.id, point });
        callback();
    });

    socket.on('sendStoryInfo', ({storyTitle, isGameStarted}, callback) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('setStoryInfo',  {storyTitle, isGameStarted});
        callback();
    });

    socket.on('sendVotingPermission', ({canVote}, callback) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('setVotingPermission', { canVote });
        callback();
    });

    socket.on(
        'sendVotingHistoryUpdate',
        (
            {room, users, points, averagePoint, averageConvertedToFib, storyTitle, stageId},
            callback
        ) => {
            const history = setVotingHistory({room, users, points, averagePoint, averageConvertedToFib, storyTitle, stageId});
            io.to(room).emit('setVotingHistory', { history: history[room] });
            callback();
        }
    );

    socket.on('deleteEstimationFromHistory', ({room, id}, callback) => {
        const history = removeEstimationFromHistory({room, id});
        io.to(room).emit('setVotingHistory', { history: history[room] });
        callback();
    });

    socket.on('removeUserFromGame', ({id, room}, callback) => {
        const user = getUser(id);
        const errorMessage = 'You where removed from the game by Admin.'
        user && io.to(user.id).emit('disconnected', errorMessage);
        callback();
    });

    socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        const time = new Date();

        io.to(user.room).emit('updateUsersData', {users: getUsersInRoom(user.room)});
        if (user.type === DEFAULT_USER_TYPE) {
            const admin = getAdminUser(user.room);
            admin && io.to(admin.id).emit('userLeft', {user: user.name, id: user.id});
        }
    }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
