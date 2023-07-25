import React,{useEffect,useRef} from 'react'
import myImg from "../../assets/images/userPranjul.jpg"
import VerticalDots from '../header/VerticalDots'
import axios from "axios";

axios.defaults.withCredentials = true

const UserHeader = ({
  isAuthenticated,
  setAuthenticated,
  allUsers,
  user_id
}) => {
  const userImage = useRef();

  useEffect(()=>{
    const controller = new AbortController();

    const getUserImage = async (user_id)=>{
      await axios.get(import.meta.env.VITE_SERVER_URL + "/getuserimagebid/",{
        responseType:"arraybuffer",
        params:{
          user_id
        },
        headers:{
          signal:controller.signal
        }
      }).then(res=>{
        const base64Image = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        userImage.current.src =  `data:${res.headers['content-type']};base64,${base64Image}`
      }).catch(err=>console.log(err))
  
    }

    isAuthenticated ? getUserImage(user_id.current):null

    return ()=>{
      controller.abort();
    }
  },[isAuthenticated])

  return (
    <div className="user-header">
        <img title="pranjul" className="user-image" ref={userImage} src={myImg} alt="user image"/>
        <div className="user-features">
            <i className="fa-solid fa-user-group"></i>
            <div className="statusIcon"></div>
            <i className="fa-solid fa-message"></i>
            <VerticalDots allUsers={allUsers} setAuthenticated={setAuthenticated}/>            
        </div>
    </div>
  )
}

export default UserHeader;