import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { Context as AppContext } from "./../App"
import "./../Clickable.css"

import NameChangeModal from "./NameChangeModal"
import "./Header.css"
import logo from "./logo.png"
import share from "./share.png"
import clipboard from "./clipboard.png"
import copiedClipboard from "./clipboard-copied.png"

const Header = () => {
  const [showModal, setShowModal] = useState(false)

  const { name } = useContext(AppContext)

  useEffect(() => {
    if (name === null || name === "") {
      setShowModal(true)
    }
  }, [name])

  return (
    <header>
      <div className="Left">
        <Link to="/" className="Clickable Title Item">
            <img src={logo} alt="logo" />
            <span>Dajsz</span>
        </Link>
      </div>
      <div className="Right">
        <div className="Name Item" onClick={() => setShowModal(true)}>
          You play as <em className="Clickable" title={name}>{name}</em>
        </div>
        <InviteButtonChooser />
      </div>

      <NameChangeModal show={showModal}
        handleClose={() => setShowModal(false)} />
    </header>)
}

const InviteButtonChooser = () => {
  if (navigator.share) {
    return <ShareButton />
  } else if (navigator.clipboard) {
    return <ClipboardButton />
  } else {
    return null
  }
}

const ShareButton = () => {
  const handleClick = () => {
    navigator.share({
      title: "Invited to Dajsz",
      text: "Click to join: ",
      url: window.location.href,
    })
      .then(() => console.log("shared"))
      .catch((error) => console.log("error sharing", error))
  }

  return (
    <div className="Clickable Share Item" title="Share" onClick={handleClick}>
      <img src={share} alt="share" />
    </div>)
}

const ClipboardButton = () => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    setTimeout(() => setCopied(false), 5000)
  }, [copied])

  const handleClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setCopied(true))
  }

  const image = copied ? copiedClipboard : clipboard

  return (
    <div className="Clickable Share Item" title="Share" onClick={handleClick}>
      <img src={image} alt="share" />
    </div>)
}

export default Header