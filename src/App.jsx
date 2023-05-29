import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage/HomePage";
import SeatsPage from "./pages/SeatsPage/SeatsPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import axios from "axios";

export default function App() {
  axios.defaults.headers.common['Authorization'] = '5bGsurQzS6RwohMxf7xqfyGT'

  const [successInfo, setSuccessInfo] = useState({});

  return (
    <BrowserRouter>
      <Header>
        <Link to="/">CINEFLEX</Link>
      </Header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assentos/:idSession" element={<SeatsPage setSuccessInfo={setSuccessInfo}/>} />
        <Route
          path="/sessoes/:idMovie"
          element={<SessionsPage />}
        />
        <Route
          path="/sucesso"
          element={<SuccessPage successInfo={successInfo} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

const Header = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c3cfd9;
  color: #e8833a;
  font-family: 'Roboto', sans-serif;
  font-size: 34px;
  position: fixed;
  top: 0;

  a {
    text-decoration: none;
    color: #e8833a;
  }
`