import React from 'react'
import "../style/Navbar.css"

const Navbar = () => {
    return (
        <div className="preNav">
            <div>
              <a  className="navlinks" href="/">Home</a> <span>|</span>
              <a  className="navlinks" href="/PastProposals">Past Proposals</a>
            </div>
            <div>
              <a  className="navlinks" href="/Profile">Profile</a>
            </div>
        </div>
    )
}

export default Navbar