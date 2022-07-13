import React, { useRef, useState } from 'react';
import './SessionUrl.css';

export default function ShowSessionUrl({ room }) {
    const urlRef = useRef();
    const [url, setUrl] = useState(`http://planning-poker.helpsystems.com/join?id=${room}`);
    const onCopyUrl = () => {
        const copyText = urlRef.current;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand('copy');
    };

    return (
        <div className="urlContainer">
            <input ref={urlRef}
                   className="url-input"
                   type="text"
                   value={url}
                   onChange={(event) => setUrl(event.target.value)}
            />
            <span className="url fade-background">{url}</span>
            <button onClick={onCopyUrl} className={'button copy-button'} type="submit">Copy</button>
        </div>
)};
