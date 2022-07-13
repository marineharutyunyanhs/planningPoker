import React from "react";
import './Topic.css';
import TextField from '@material-ui/core/TextField';
import {
  withStyles,
} from '@material-ui/core/styles';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
        color: '#0071bc',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#0071bc',
    }},
})(TextField);


export default function Topic({
     startGame,
     reStartGame,
     isGameStarted,
     storyTitle,
     setStoryTitle,
     openCards,
     areCardsOpen
}) {

    return (
        <div className="user-story-info-container" >
            <form className="form" noValidate autoComplete="off">
                <CssTextField
                    label="Story Description"
                    fullWidth
                    multiline={true}
                    value={storyTitle}
                    onChange={({target: {value}}) => !(isGameStarted && !areCardsOpen) ? setStoryTitle(value): null}
                    onKeyPress={e => e.key === 'Enter' ? startGame(e) : null}
                />
                {/*{
                    !(isGameStarted && !areCardsOpen) &&
                    storyTitle &&
                    <span className="clearIcon" onClick={() => setStoryTitle("")}>X</span>
                }*/}
            </form>
            <div className="action-buttons-wrapper">
                <button className="button send-button mt-20"
                        disabled={isGameStarted && !areCardsOpen}
                        onClick={startGame}
                >
                    Start Voting
                </button>
                <button className="button ml-20 mt-20 open-cards-button"
                        disabled={!isGameStarted || areCardsOpen}
                        onClick={openCards}>
                    Open Cards
                </button>
                <button className="button ml-20 mt-20 stop-game-button"
                        disabled={!isGameStarted || areCardsOpen}
                        onClick={()=> reStartGame()}>
                    Discard
                </button>
            </div>
        </div>
    )
};
