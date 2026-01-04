import React from "react";
import { Routes, Route, } from "react-router-dom";
import './App.css';
import AddPlantPage from "./pages/AddPlantPage";
import {PlantDetailPage} from "./pages/PlantDetailPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat";

import { getOrCreateToken } from './utils/auth';

function App() {
  const token = getOrCreateToken(); 

  return (
    <>
    <div>
      

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/plants/:id" element={<PlantDetailPage />} />
        <Route path="/add" element={<AddPlantPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <NavBar />
    </div>
    </>
  )
}

export default App
