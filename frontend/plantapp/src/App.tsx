import React from "react";
import { Routes, Route, } from "react-router-dom";
import './App.css';
import AddPlantPage from "./pages/AddPlantPage";
import {PlantDetailPage} from "./pages/PlantDetailPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat";
import EditPage from "./pages/EditPage";


function App() {

  return (
    <>
    <div>
      

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/plants/:id" element={<PlantDetailPage />} />
        <Route path="/add" element={<AddPlantPage />} />
        <Route path="/chat/:plantId" element={<Chat />} />
        <Route path="/edit/:plantId" element={<EditPage />} />
      </Routes>
      <NavBar />
    </div>
    </>
  )
}

export default App
