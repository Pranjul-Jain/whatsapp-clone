import "./Signup.css"
import React,{useRef,useEffect} from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from "axios"

axios.defaults.withCredentials = true

const Signup = ({
  isAuthenticated,
  setAuthenticated
}) => {
  const responseMessage = useRef("");
  const navigate = useNavigate();

  useEffect(()=>{
    const controller = new AbortController()
    const getAuthenticateData = async ()=> {
     const response =  await axios.get(import.meta.env.VITE_SERVER_URL + "/authenticate/",{signal:controller.signal}).then(res=> res).catch(err=>err)
     const data = await response.data;
     if(data){
      if(data.message === "authorized"){
        setAuthenticated(true)
        navigate("/")
      }
    }
  }
    
    !isAuthenticated?getAuthenticateData():null;

    return ()=>{
      controller.abort()
    }
    
  },[isAuthenticated])

  return (
    <div className="login-page">
        <div className="frame">
            <form className="login-form" method="POST" action="/user" onSubmit={signup}>
                <h1>Sign up</h1>
                <input type="text" name="username" id="username" placeholder='Enter your username' required />
                <input type="text" name="number" id="number" placeholder='Enter Your Phone Number' required />
                <div className="file-input">
                    <label htmlFor="user-image" id="user-image-label">Upload your image</label>
                    <input type="file" name="user-image" id="user-image" accept="image/*" onChangeCapture={changeColor} placeholder="Upload Your Image" />
                </div>
                <input type="password" name="password" id="password" placeholder="Enter Your password" required />
                <input type="password" name="co-password" id="co-password" placeholder="Enter your password again" required />
                <div className="button-block">
                  <Link className="btn-link" to="/login">Already Signup?</Link>
                  <button type="submit" className="btn-log">Register</button>
                </div>
                <span ref={responseMessage} className="btn-response d-none">{null}</span>
            </form>
        </div>
    </div>
  )

  async function signup(event){
    event.preventDefault()
    
    const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/register",{
      username : event.target.username.value,
      number : event.target.number.value,
      "user-files" : event.target['user-image'].files[0],
      "password" : event.target.password.value
    },{
      headers : {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res=>res).catch(err=>console.log(err))
    
    if(response.status === 200){
      const data = await response.data;
      responseMessage.current.innerText = data.message;
      responseMessage.current.style.display = "block";
    }else if(response.status === 201){
      const data = await response.data;
      responseMessage.current.innerText = data.message;
      responseMessage.current.style.display = "block";
    }

  }

  function changeColor(event){
    const label = document.querySelector("#user-image-label")
    label.style.backgroundColor = "#191919";
    label.innerText = event.target.files[0].name.trim().slice(0,15)+"..."
  }
}

export default Signup;