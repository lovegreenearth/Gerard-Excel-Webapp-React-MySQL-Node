import React from "react";
import "../../Styles/header.css"
import { Button } from 'antd';

function Header({ title }) {
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div>
      <header>
        <div className="header-info">
          <h2>{title}</h2>
          <input type="button" className="logout-btn" onClick={() => logout()} value={"Logout"} />
        </div>
      </header>
    </div>
  );

}

export default Header;