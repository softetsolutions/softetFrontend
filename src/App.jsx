import './App.css'
import Home from './pages/Home'
import Codet from './pages/Codet'
import Frontet from './pages/Frontet';
import JsonDiffet from './pages/JsonDiffet';
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tools/codet" element={<Codet />} />
    {/* Temprory frontent route */}
    <Route path="/tools/Frontet" element={<Frontet />} />
    <Route path="/tools/jsonDiff" element={<JsonDiffet />} />
    </Routes>
    
   </>
  )
}

export default App
