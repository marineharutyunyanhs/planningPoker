import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import Cookies from 'js-cookie'
import User from './User/User';
import SocketHelper from '../SocketHelper';
import Admin from './Admin/Admin';
import './Game.css';

import {
    DEFAULT_USER_TYPE,
    ADMIN_USER_TYPE,
    ENDPOINT,
} from "../utils";

let socket;

const Game = ({ location }) => {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [room, setRoom] = useState('');


    useEffect(() => {
        const {name, id: room} = queryString.parse(location.search);
        const cookieId = Cookies.get('id');
        const type = cookieId && cookieId === room ?  Cookies.get('userType') : DEFAULT_USER_TYPE;

        socket = new SocketHelper(ENDPOINT);

        setRoom(room);
        setName(name);
        setType(type);

    }, [ENDPOINT, location.search]);

    return (
        type === ADMIN_USER_TYPE
            ? <Admin socket={socket.get()} room={room} name={name} userType={type} />
            : type === DEFAULT_USER_TYPE
                ? <User socket={socket.get()} room={room} name={name} userType={type} />
                : null
    );
};

export default Game;
