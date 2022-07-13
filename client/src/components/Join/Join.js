import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import Cookies from 'js-cookie'

import './Join.css';

export default function SignIn({ location }) {
    const buttonRef = useRef(null);
    const cachedName = Cookies.get('userName');
    const [name, setName] = useState(cachedName || '');
    const { id: room } = queryString.parse(location.search);

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
            <div>
                <input autoFocus
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="joinInput"
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => (e.key === 'Enter' && name && room) && buttonRef.current.click()}
                />
            </div>
                <Link ref={buttonRef}
                      to={`/game?id=${room}&name=${name}`}
                      onClick={e => (!name || name.trim().length === 0 || !room) ? e.preventDefault() : Cookies.set('userName', name)}
                >
                    <button className={'button mt-20'} type="submit">Join</button>
                </Link>
            </div>
        </div>
    );
}
