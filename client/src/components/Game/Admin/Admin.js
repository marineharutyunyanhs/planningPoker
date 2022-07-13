import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie'

import VotingHistory from '../../VotingHistory/VotingHistory';
import SessionUrl from '../../CreateSession/SessionUrl';
import FlipCard from '../FlipCard/FlipCard.js';
import Topic from '../Topic/Topic';

import './Admin.css';

import {
    DEFAULT_USER_TYPE,
    NO_POINT,
    getUnicID,
    getEstimatorsCount,
    getAveragePoint
} from "../../utils";


const Admin = ({socket, room, name, userType}) => {

    const [users, setUsers] = useState([]);
    const [points, setPoints] = useState({});
    const [stageId, setStageId] = useState('');
    const [type, setType] = useState(userType);
    const [hasError, setHasError] = useState(false);
    const [history, setVotingHistory] = useState([]);
    const [storyTitle, setStoryTitle] = useState('');
    const [areCardsOpen, setOpenCards] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isBeingReEstimated, setIsBeingReEstimated] = useState(false);
    const [highlightLastScore, setHighlightLastScore] = useState(false);

    useEffect(() => {
        setHighlightLastScore(false);
        socket.emit('join', { name, type, room }, (error) => {
            if(error) {
                setType(Cookies.get('userType') || type);
                setHasError(true);
                socket.emit('disconnect');
                socket.off();
                alert(error);
            } else {
                reStartGame();
            }
        });
    }, [name, type, room]);

    useEffect(() => {
        const estimators = getEstimatorsCount(users);
        if (estimators > 0 && Object.keys(points).length - 1 === estimators && !areCardsOpen) {
            openCards();
        }
    }, [points, users]);

    useEffect(() => {

        socket.on('userJoined', (data) => {
            if (isGameStarted && storyTitle && !hasError) {
                socket.emit('sendStoryInfo', {
                    storyTitle,
                    isGameStarted: true
                }, () => {});
                socket.emit('sendVotingPermission', {canVote: !areCardsOpen}, () => {});
            }
        });

        socket.on('updateUsersData', ({users}) => {
            setUsers(users);
        });

        socket.on('setEstimateOnCards', (data) => {
            points[data.id] = data.point;
            setPoints({...points});
        });

        socket.on('setVotingHistory', (data) => {
            setVotingHistory(data.history);
        });

        socket.on('userLeft', ({id}) => {
            if (points[id]) {
                const {[id]: removedPoint, ...updatedPoints} = points;
                setPoints(updatedPoints);
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    });

    const openCards = () => {
        const {average: averagePoint, averageConvertedToFib} = getAveragePoint(points);
        setOpenCards(true);
        socket.emit('sendVotingPermission', {canVote: false}, () => {});
        socket.emit(
            'sendVotingHistoryUpdate',
            {
                room,
                users,
                points,
                averagePoint,
                averageConvertedToFib,
                storyTitle,
                stageId
            },
            () => {
                setIsBeingReEstimated(false);
                setHighlightLastScore(true);
            }
        );
    };

    const startGame = (event) => {
        event.preventDefault();
        !isBeingReEstimated && reStartGame();
        if(storyTitle && storyTitle.trim().length) {
            socket.emit('sendStoryInfo', {
                storyTitle,
                isGameStarted: true
            }, () => setIsGameStarted(true));
            socket.emit('sendVotingPermission', {canVote: true}, () => {});
            !isBeingReEstimated && setStageId(getUnicID());
        } else {
            alert("Please enter story information to start the voting");
        }
    };

    const reStartGame = (titleFromHistory) => {
        if (!hasError) {
            socket.emit('sendStoryInfo', {
                storyTitle: titleFromHistory || storyTitle ,
                isGameStarted: false
            }, () => setIsGameStarted(false));
            socket.emit('sendVotingPermission', {canVote: false}, () => {});
            setOpenCards(false);
            setPoints({['']: '?'});
            setStageId('');
            setIsBeingReEstimated(false);
        }
    };

    const deleteEstimation = (id) => {
        socket.emit('deleteEstimationFromHistory', {room, id}, () => {});
    };

    const removeUser = (id) => {
        socket.emit('removeUserFromGame', {room, id}, () => {});
    };

    const reEstimate = (id, title) => {
        setStoryTitle(title);
        reStartGame(title);
        setStageId(id);
        setIsBeingReEstimated(true);
    };

    return (
        hasError ?
            <Redirect to={'/'} />
            :
            <>
                <div className="sectionOne">
                    <div className="topicContainer">
                        <Topic openCards={openCards}
                               startGame={startGame}
                               storyTitle={storyTitle}
                               reStartGame={reStartGame}
                               areCardsOpen={areCardsOpen}
                               setStoryTitle={setStoryTitle}
                               isGameStarted={isGameStarted}
                        />
                    </div>
                    <div className="content">
                        <div className="participants">
                            {users.length && users.length>1 ?
                                users.map((user,i) => (
                                    user.type === DEFAULT_USER_TYPE ?
                                        <div key={i}>
                                            <FlipCard name={user.displayName}
                                                      id={user.id}
                                                      removeUser={removeUser}
                                                      openCards={areCardsOpen}
                                                      point={points[user.id] || NO_POINT}
                                            />
                                        </div>
                                        :
                                        null
                                ))
                                :
                                <div>No User</div>}
                        </div>
                    </div>
                </div>
                <div className="sectionTwo">
                    <h2 className="title">Estimation History</h2>
                    <VotingHistory history={history}
                                   reEstimate={reEstimate}
                                   reStartGame={reStartGame}
                                   deleteEstimation={deleteEstimation}
                                   highlightLastScore={highlightLastScore}
                                   isBeingReEstimated={isBeingReEstimated}
                    />
                    <h2 className="title mt-40">Invite teammates</h2>
                    <SessionUrl room={room} />
                </div>
            </>
        );
};

export default Admin;
