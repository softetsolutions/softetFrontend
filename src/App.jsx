import './App.css'
import Home from './pages/Home'
import Codet from './pages/Codet'
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tools/codet" element={<Codet />} />
    </Routes>
    
   </>
  )
}

export default App
