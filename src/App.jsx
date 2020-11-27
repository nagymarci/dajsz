import React, { useState, useEffect } from "react"
import Yahtzee from "./Yahtzee"
import "./App.css"
import * as api from "./api"

const App = () => {
  const gameFromHash = window.location.hash.substring(2)
  const [game, setGame] = useState(gameFromHash !== "" ? gameFromHash : null)
  const [player, setPlayer] = useState(window.localStorage.getItem("name"))

  const handleNameChange = (newName) => {
    window.localStorage.setItem("name", newName)
    setPlayer(newName)
  }

  const handleNewGame = (newGame) => {
    setGame(newGame)
  }

  return (
    <div>
      <Player
        name={player}
        onNameChange={handleNameChange}
        onNewGame={handleNewGame}
    />
      { game != null ?
        <Yahtzee player={player} game={game} /> :
        undefined }
    </div>
  )
}

const Player = ({ name, onNameChange, onNewGame }) => {
  const handleClickOnNewGame = () => {
    api.create(name)
      .then((gameId) => {
        window.location.hash = gameId
        return gameId
      })
      .then(gameId => gameId.substring(1))
      .then(gameId => {
        api.join(gameId, name)
        return gameId
      })
      .then((gameId) => onNewGame(gameId))
  }

  const promptForName = (currentName, callback) => {
    let newName = null

    while (newName === null) {
      newName = prompt("Please enter your name:", currentName)
    }

    callback(newName)
  }

  useEffect(() => {
    if (name === null) {
      promptForName(name, onNameChange)
    }
  }, [name, onNameChange])

  const finalName = (name !== null ? name : "<Player>")

  return (
    <div className="menu">
      <div className="actions">
        <div className="actionable button" onClick={handleClickOnNewGame}><em>New Game</em></div>
        <InviteButtonChooser />
      </div>

      <div className="player" onClick={() => promptForName(name, onNameChange)}>
        You play as <em className="actionable">{finalName}</em>.
      </div>
    </div>)
}

const InviteButtonChooser = () => {
  const url = window.location.toString()

  if (navigator.share) {
    return <ShareButton url={url} />
  } else if (navigator.clipboard) {
    return <ClipboardButton url={url} />
  } else {
    return null
  }
}

const ShareButton = ({ url }) => {
  const handleClick = () => {
    navigator.share({
      title: "Invited to Dajsz",
      text: "Click to join: ",
      url: url,
    })
      .then(() => console.log("shared"))
      .catch((error) => console.log("error sharing", error))
  }

  return (
    <div className="actionable button" onClick={handleClick}>
      <div className="share icon"></div>
    </div>)
}

const ClipboardButton = ({ url }) => {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => setCopied(true))
  }

  if (copied) {
    setTimeout(() => setCopied(false), 5000)
  }

  const classes = ["clipboard", "icon"]
  if (copied) {
    classes.push("copied")
  }
  const className = classes.join(" ")

  return (
    <div className="actionable button" onClick={handleClick}>
      <div className={className}></div>
    </div>)
}

export default App
