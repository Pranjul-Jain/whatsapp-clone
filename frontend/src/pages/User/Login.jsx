import "./Signup.css";
import React,{useRef,useEffect} from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from "axios"
import Input from "../../components/user/Input";
import Csrftoken from "../../components/Csrftoken";

axios.defaults.withCredentials = true;

const Login = ({
  isAuthenticated,setAuthenticated,
  user_id
}) => {
  const responseMessage = useRef("");
  const password_err = useRef();
  const number_err = useRef();
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
                <Input className="input-block" inputClassName="form-control" type="text" name="number" id="login-number" errorMessage="error-message" placeholder='Enter your username' required={true} errorref={number_err} />
                <Input className="input-block" inputClassName="form-control" type="password" name="password" id="login-password" errorMessage="error-message" placeholder='Enter your password' required={true} errorref={password_err} />
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

    if(checkFormData(event)){
       
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

  function checkFormData(event){
    let isValid = true;

    if(event.target.password.value.trim().length<8 || !event.target.password.value.match(/^[A-Z]\w+[^\w]+$/)){
      password_err.current.style.display = "block";
      password_err.current.innerText = "Password should be at least 8 character long and password should start from uppercase letter and should contain atleast one special character at the end";
      isValid = false;
    }else{
      password_err.current.style.display = "none";
      password_err.current.innerText = "";
    }

    if(event.target.number.value.trim().length!=12){
      number_err.current.style.display = "block";
      number_err.current.innerText = "Invalid phone number(phone number must contain country code at the beginning)";
      isValid = false;
    }else{
      number_err.current.style.display = "none";
      number_err.current.innerText = "";
    }

    return isValid;
  }

}

export default Login