import './App.css'
import React , {useState,useRef} from "react"
import { Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home'
import Login from './pages/User/Login';
import Signup from './pages/User/Signup';

function App() {
  const [isAuthenticated,setAuthenticated] = useState(false)
  const user_id = useRef()

  return (
    <Routes>
      <Route path="/" element={<Home user_id={user_id} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />} />
      <Route path="signup" element={<Signup isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />} />
      <Route path="login" element={<Login user_id={user_id} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />} />
    </Routes>
  )
}

export default App;
