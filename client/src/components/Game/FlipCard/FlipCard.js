import React from "react";
import ReactEmoji from "react-emoji";
import {
    NO_POINT,
    DEFAULT_POINT
} from "../../utils";

import './FlipCard.css';

export default function FlipCard({name, id, point, openCards, removeUser}) {
    const className = openCards ?
        'open'
        :
        point !== NO_POINT ? 'hasPoint' : '';
    return (
        <div className={`flip-card ${className}`} >
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <span className="material-icons cancle removeUser"
                          title={`Remove ${name} from the game`}
                          onClick={() => removeUser(id)}
                    >
                        close
                    </span>

                    <h2>{ReactEmoji.emojify(name)}</h2>
                </div>
                <div className="flip-card-back" title={name}>
                    <span className="material-icons cancle removeUser"
                          title={`Remove ${name} from the game`}
                          onClick={() => removeUser(id)}
                    >
                        close
                    </span>

                    <h1>{point === NO_POINT ? DEFAULT_POINT : point}</h1>
                    <p>{null}</p>
                </div>
            </div>
        </div>
    )
};
