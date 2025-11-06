import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

export default function Header({ title, leftButton, rightButton }) {
  return (
    <header className="header d-flex align-items-center px-3">
      {leftButton ? (
        <button
          className={`btn ${leftButton.variant || "btn-outline-light"} me-3`}
          onClick={leftButton.onClick}
        >
          {leftButton.label}
        </button>
      ) : null}

      <h1 className="m-0 text-white">{title}</h1>

      {rightButton ? (
        <button
          className={`btn ${rightButton.variant || "btn-outline-light"} ms-auto`}
          onClick={rightButton.onClick}
        >
          {rightButton.label}
        </button>
      ) : null}
    </header>
  );
}
