import React from 'react';

import './InfoBar.css';

const InfoBar = ({  room, storyTitle }) => {

    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <h3>{storyTitle ? storyTitle : "No Topic"}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href={`/join?id=${room}`}>
                    <span className="material-icons exitIcon" title={"Exit"}>close</span>
                </a>
            </div>
        </div>
    );
};

export default InfoBar;