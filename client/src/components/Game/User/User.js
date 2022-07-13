import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie'

import VotingHistory from '../../VotingHistory/VotingHistory';
import InfoBar from '../InfoBar/InfoBar';
import Card from '../Card/Card.js';

import './User.css';

import {
    FIBONACCI_NUMBERS,
} from "../../utils";


const User = ({socket, room, name, userType}) => {

    const [type, setType] = useState(userType);
    const [hasError, setHasError] = useState(false);
    const [history, setVotingHistory] = useState([]);
    const [storyTitle, setStoryTitle] = useState('');
    const [selectedPoint, setSelectedPoint] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [haveVotingPermission, setVotingPermission] = useState(false);

    useEffect(() => {
        socket.emit('join', { name, type, room }, (error) => {
            if(error) {
                setType(Cookies.get('userType') || type);
                setHasError(true);
                socket.emit('disconnect');
                socket.off();
                alert(error);
            }

        });
    }, [name, type, room]);


    useEffect(() => {

        socket.on('disconnected', (errorMessage) => {
            setHasError(true);
            socket.disconnect();
            socket.off();
            alert(errorMessage);
        });

        socket.on('setStoryInfo', (data) => {
            setStoryTitle(data.storyTitle);
            setIsGameStarted(data.isGameStarted);
            if (!data.isGameStarted){
                setSelectedPoint(false);
            }
        });

        socket.on('setVotingPermission', (data) => {
            setVotingPermission(data.canVote);
        });

        socket.on('setVotingHistory', (data) => {
            setVotingHistory(data.history);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    });

    const sendEstimate = (event, number) => {
        event.preventDefault();
        if (number) {
            socket.emit('sendEstimate', number, () => setSelectedPoint(number));
        }
    };

    return (
         hasError ?
            <Redirect to={`/join?id=${room}`} />
            :
            <>
                <InfoBar storyTitle={storyTitle} room={room} />
                <div className="sectionOne">
                    <div className="content">
                        <div className="cardsContainer">
                            {FIBONACCI_NUMBERS.map((number, i) =>
                                <div key={i}>
                                    <Card name={name}
                                          cardNumber={number}
                                          sendEstimate={sendEstimate}
                                          isGameStarted={isGameStarted}
                                          selectedPoint={selectedPoint}
                                          haveVotingPermission={haveVotingPermission}
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="sectionTwo">
                    <h2 className="title">Estimation History</h2>
                    <VotingHistory history={history}/>
                </div>
            </>
    );
};

export default User;
