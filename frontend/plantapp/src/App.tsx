import React from "react"
import { Routes, Route, } from "react-router-dom"
import './App.css'
import AddPlantPage from "./pages/AddPlantPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";

function App() {

  return (
    <>
      <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/plants/:id" element={<PlantDetailPage />} />
        <Route path="/add" element={<AddPlantPage />} />
      </Routes>
    </div>
    </>
  )
}

export default App
