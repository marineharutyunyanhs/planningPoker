import React from 'react';
import './AuthorizationDemo.css';
import {Link} from "react-router-dom";

export default function Authorization() {
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer authorizationDemo">
                <h1 className="heading">Page is Under Construction - Coming Soon</h1>
                <Link to="/">
                    <button className={'button mt-20'}> Back to main page </button>
                </Link>
            </div>
        </div>
    );
}
