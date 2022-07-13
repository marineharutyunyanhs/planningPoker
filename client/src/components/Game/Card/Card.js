import React, { useEffect } from "react";

import './Card.css';
import {BrowserTitle} from "../../utils";
let timeoutId = null;

export default function Card(
    {name,
     cardNumber,
     sendEstimate,
     selectedPoint,
     isGameStarted,
     haveVotingPermission
    })
{
    let selectedClassName = selectedPoint && selectedPoint === cardNumber ? "selected" : "";
    selectedClassName = isGameStarted ? selectedClassName : "";

    const blink = (message) => document.title = document.title === message ? BrowserTitle : message;

    const clearBlinking = () => {
        clearInterval(timeoutId);
        document.title = BrowserTitle;
        timeoutId = null;
    };

    const onCardClick = (e) => {
        e.preventDefault();
        if (isGameStarted && haveVotingPermission) {
            sendEstimate(e, cardNumber);
            clearBlinking();
        }
    };

    useEffect(() => {
        if (isGameStarted && haveVotingPermission && !timeoutId) {
            timeoutId = setInterval(() => blink(`Please vote ${name}`), 1000);
        } else if (!haveVotingPermission && timeoutId) {
            clearBlinking();
        }

        return () => {
            if(timeoutId) {
                clearBlinking();
            }
        }
    } , [haveVotingPermission, isGameStarted, name]);

    const allowedToVote = isGameStarted && haveVotingPermission;
    return (
        <div className={`card ${selectedClassName} ${allowedToVote ? 'clickable' : ''}`} onClick={onCardClick}>
            <div className="card-inner">
                <h1>{cardNumber}</h1>
            </div>
        </div>
    )
};
