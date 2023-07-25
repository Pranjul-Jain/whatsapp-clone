import "./Signup.css";
import React,{useRef,useEffect} from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from "axios"
import cookie from "js-cookie"
import Csrftoken from "../../components/Csrftoken";

axios.defaults.withCredentials = true;

const Login = ({
  isAuthenticated,setAuthenticated,
  user_id
}) => {
  const responseMessage = useRef("");
  Csrftoken();

  const navigate = useNavigate();

  useEffect(()=>{
    const controller = new AbortController()
    const getAuthenticateData = async ()=> {
    const response =  await axios.get(import.meta.env.VITE_SERVER_URL + "/authenticate/",{signal:controller.signal}).then(res=> res).catch(err=>err)
    const data = await response.data;
  
    if(data){
      if(data.message === "authorized"){
        setAuthenticated(true)
        user_id.current = data.user_id
      }
    }
  }
    
    !isAuthenticated?getAuthenticateData():null;
    isAuthenticated?navigate("/"):null;
    return ()=>{
      controller.abort()
    }
  },[isAuthenticated])

  return (
    <div className="login-page">
        <div className="frame">
            <form className="login-form" method="POST" onSubmit={login}>
                <h1>Sign in</h1>
                <input type="text" name="number" id="number" placeholder='Enter your phone number' required />
                <input type="password" name="password" id="password" placeholder="Enter your password" required />
                <div className="button-block">
                  <Link className="btn-link" to="/signup">Not registered?</Link>
                  <button type="submit" className="btn-log">Login</button>
                </div>
                <span ref={responseMessage} className="btn-response d-none">{null}</span>
            </form>
        </div>
    </div>
  )

  async function login(event){
    event.preventDefault();
    console.log("csrftoken : " + cookie.get("csrftoken"))

    const formData = new FormData();
    formData.append("number",event.target.number.value)
    formData.append("password",event.target.password.value)

    const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/login",formData,{
      headers:{
        "Content-Type" : "application/json",
      },
      "withCredentials" : true,
    }).then(res=>res).catch(error=>console.log(error))
    
    if(response && response.status === 200){
      const data = await response.data
      if(data.message == "login successfully"){
        navigate("/")
      }
      responseMessage.current.innerText = data.message
      responseMessage.current.style.display = "block";
    }

  }

}

export default Login