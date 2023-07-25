import React,{useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

axios.defaults.withCredentials = true

const VerticalDots = ({
  setAuthenticated,
  allUsers
}) => {
  const query =  useRef("")
  const navigate = useNavigate()

  return (
    <div onClick={()=>toggleList("user-header-dots")} id="user-header-dots" className='popup-container'>
        <i className="fa-solid fa-ellipsis-vertical"></i>
        <ul className="popup">
            <li onClick={()=>toggleForm(".add-member-section")}>New Member</li>
            <li onClick={()=>toggleForm(".add-members-section")}>New Group</li>
            <li onClick={logout}>Logout</li>
        </ul>
    </div>
  )

  async function logout(){
    const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/logout/').then(res=>res).catch((err)=>console.log(err))
    const data = await response.data

    if(data.message === "logout"){
      setAuthenticated(false)
      navigate("/login")
    }
  }

  function toggleForm(className){
    const memberForm = document.querySelector(className)

    if(memberForm.style.left === "-100%" || !memberForm.style.left){
      memberForm.style.left = "0";
    }else{
      memberForm.style.left = "-100%";
    }

  }

  function toggleList(id){
    query.current = "#"+id
    const display = document.querySelector(query.current+" .popup").style.display

    document.querySelector(query.current+" .popup").style.display = !display?"grid":null;
    document.querySelector(query.current).style.backgroundColor = !display?"rgba(77, 88, 95, 0.712)":null;

    !display
    ?document.addEventListener("click", outsideClickHandler)
    :document.removeEventListener("click", outsideClickHandler);

  }

  function outsideClickHandler(event) {
    const popupContainer = document.querySelector(query.current);
    if (!popupContainer.contains(event.target)) {
      document.querySelector(query.current+" .popup").style.display = null;
      popupContainer.style.backgroundColor = null;
    }
  }
  
}

export default VerticalDots