import "./Signup.css"
import Input from "../../components/user/Input"
import React,{useRef,useEffect} from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from "axios"

axios.defaults.withCredentials = true

const Signup = ({
  isAuthenticated,
  setAuthenticated
}) => {
  const responseMessage = useRef("");
  const username_err  = useRef();
  const number_err = useRef();
  const password_err = useRef();
  const copassword_err = useRef();
  const navigate = useNavigate();

  useEffect(()=>{
    const controller = new AbortController();
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
                <Input className="input-block" inputClassName="form-control" type="text" name="username" id="username" errorMessage="error-message" placeholder='Enter your username' required={true} errorref={username_err} />
                <Input className="input-block" inputClassName="form-control" type="text" name="number" id="number" errorMessage="error-message" placeholder='Enter your phone number' required={true} errorref={number_err} />
                <div className="file-input">
                    <label htmlFor="user-image" id="user-image-label">Upload your image</label>
                    <input type="file" name="user-image" id="user-image" accept="image/*" onChangeCapture={changeColor} placeholder="Upload Your Image" />
                </div>
                <Input className="input-block" inputClassName="form-control" type="password" name="password" id="password" errorMessage="error-message" placeholder='Enter your password' required={true} errorref={password_err} />
                <Input className="input-block" inputClassName="form-control" type="password" name="co-password" id="co-password" errorMessage="error-message" placeholder='Confirm your password' required={true} errorref={copassword_err} />
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
    if(checkFormData(event)){
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

  }

  function checkFormData(event){
    let isValid = true;
    if(event.target.username.value.trim().length<5){
      username_err.current.style.display = "block";
      username_err.current.innerText = "Username should be at least 5 character long";
      isValid = false;
    }else{
      username_err.current.style.display = "none";
      username_err.current.innerText = "";
    }

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

    if(event.target.password.value.trim() != event.target['co-password'].value.trim()){
      copassword_err.current.style.display = "block";
      copassword_err.current.innerText = "Password does not match";
      isValid = false;
    }else{
      copassword_err.current.style.display = "none";
      copassword_err.current.innerText = "";
    }

    return isValid;
  }

  function changeColor(event){
    const label = document.querySelector("#user-image-label")
    label.style.backgroundColor = "#191919";
    label.innerText = event.target.files[0].name.trim().slice(0,15)+"..."
  }
}

export default Signup;