import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE} from "../utils";

import './VotingHistory.css';

const VotingHistory = (
    {
        history,
        deleteEstimation,
        isBeingReEstimated,
        highlightLastScore,
        reEstimate,
        reStartGame
}) => {

    const [itemId, setItemId] = useState(null);

    const onReEstimate = (id, title) => {
        setItemId(id);
        reEstimate(id, title);
    };

    const onCancleReEstimate = () => {
        setItemId(null);
        reStartGame(' ');
    };

    useEffect(() => {
        !isBeingReEstimated && setItemId(null);
    }, [isBeingReEstimated]);

    return (
        <ScrollToBottom mode={"top"} className="historyContainer fade-background">
            <div className={`activeContainer ${highlightLastScore ? 'highlight-last-score' : '' }`}>
                {history && history.length ?
                    history.map(stage => (
                        <div className={itemId === stage.id ? 'highlight': ''} key={stage.id}>
                            <div className="topWrapper">
                                <div className="story-title">{stage.storyTitle}</div>
                                {
                                    (reEstimate || deleteEstimation) &&
                                    <div className="actionsWrapper">
                                        {
                                            !isBeingReEstimated &&
                                            <>
                                            <span className="material-icons replay"
                                                  title={"Re-estimate"}
                                                  onClick={() => onReEstimate(stage.id, stage.storyTitle)}
                                            >
                                                replay
                                            </span>
                                            <span className="material-icons delete"
                                                  title={"Delete"}
                                                  onClick={() => deleteEstimation(stage.id)}
                                            >
                                                delete
                                            </span>
                                            </>
                                        }
                                        {
                                            isBeingReEstimated && itemId === stage.id &&
                                            <span className="material-icons cancle"
                                                  onClick={() => onCancleReEstimate()}
                                            >
                                                close
                                            </span>
                                        }

                                    </div>
                                }
                            </div>
                            <div className="averageNumber inline-block">Average fibonacci number: {stage.averageConvertedToFib}</div>
                            <div className="averageNumber">Average number: {stage.averagePoint}</div>
                            <ul className="participantsVotes">
                                {
                                    stage.users.map(({displayName, type, point}, i) => (
                                        type === DEFAULT_USER_TYPE ?
                                            <li key={i}>{ReactEmoji.emojify(displayName)}{`: ${point || " ?" }`}</li>
                                            :
                                            null
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                    :
                    <div>No history yet</div>
                }
            </div>
        </ScrollToBottom>
    );
};

VotingHistory.defaultProps = {
    isBeingReEstimated: false,
    highlightLastScore: false,
};

export default VotingHistory;
