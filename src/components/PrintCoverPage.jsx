import React from "react";
import "./PrintCoverPage.css";
import logo from "../assets/black_logo.png";

const PrintCoverPage = () => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="printable-area">
      <div className="cover-page">
        <img className="logo" src={logo} alt="Coquillade Logo" />
        <h1 className="title">Coquillade: New Server Structure</h1>
        <p className="date">{today}</p>
      </div>
    </div>
  );
};

export default PrintCoverPage;
