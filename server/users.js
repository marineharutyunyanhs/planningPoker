const users = [];
const history= {};
const {ADMIN_USER_TYPE, DEFAULT_USER_TYPE} = require('./utils');

const addUser = ({ id, name, type, room }) => {
    if(!name) return { error: 'Name is required.' };
    if(!room) return { error: 'Game code is missing or incorrect' };
    const displayName = name;
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name && user.id === id );
    if(existingUser) return { error: 'Please close all open PP project tabs in the browser and come back refresh this page' };

    const getAdmin = users.find((user) => user.room === room && user.type === ADMIN_USER_TYPE );
    /*if(getAdmin && type === ADMIN_USER_TYPE) {
        const duplicatedAdmin = users.find((user) => user.room === room && user.type === ADMIN_USER_TYPE && getAdmin.id !== id);
        if (duplicatedAdmin) {
            return getAdmin;
        }
    }*/
    if(type === DEFAULT_USER_TYPE && !getAdmin) return { error: 'Wrong url or Admin ended game session please ask admin to send new url' };

    const user = { id, name, displayName, type, room };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
  const index = getUserIndex(id);
  if(index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserIndex = (id) => users.findIndex((user) => user.id === id);

const getAdminUser = (room) => users.find((user) => user.type === ADMIN_USER_TYPE && user.room === room);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getVotingHistory = room => history[room] || [];

const setVotingHistory = ({room, users, points, averagePoint, averageConvertedToFib, storyTitle, stageId}) => {
    if (users && users.length) {
        const lastEstimation = {users:[], averagePoint, averageConvertedToFib, storyTitle, id:stageId};
        users.forEach((user) => {
            lastEstimation.users.push({
                name: user.name,
                displayName:user.displayName,
                point: points[user.id],
                type: user.type,
                id: user.id
            });
        });

        if (history.hasOwnProperty(room)) {
            const existingHistoryItemIndex = history[room].findIndex(stage => stage.id === stageId);
            if (existingHistoryItemIndex === -1) {
                history[room].unshift(lastEstimation);
            } else {
                history[room][existingHistoryItemIndex] = lastEstimation;
            }
        } else {
            history[room] = [lastEstimation];
        }
    }
    return history
};

const removeEstimationFromHistory = ({room, id}) => {
    if (history.hasOwnProperty(room)) {
        const existingHistoryItemIndex = history[room].findIndex(stage => stage.id === id);
        if (existingHistoryItemIndex !== -1) {
            history[room].splice(existingHistoryItemIndex, 1);
        }
    }
    return history
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAdminUser,
    getVotingHistory,
    setVotingHistory,
    removeEstimationFromHistory
};
