import './App.css'
import Home from './pages/Home'
import Codet from './pages/Codet'
import JsonDiffet from './pages/JsonDiffet';
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tools/codet" element={<Codet />} />
    <Route path="/tools/jsonDiff" element={<JsonDiffet />} />
    </Routes>
    
   </>
  )
}

export default App
