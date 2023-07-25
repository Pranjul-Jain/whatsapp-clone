import React,{useRef,useEffect} from 'react'
import sampleUserImg from "../../assets/images/sample_user.jpg"
import axios from "axios"

const Navbar = ({
  heading,
  sub_heading,
  image
}) => {
  const imageUrl = useRef("")

  useEffect(()=>{
    const controller = new AbortController();

    const getUserImage = (image)=>{
      axios.get(import.meta.env.VITE_SERVER_URL + "/getuserimage/",{
        responseType:"arraybuffer",
        params:{
          image
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
        imageUrl.current.src = `data:${res.headers['content-type']};base64,${base64Image}`;
      }).catch(err=>console.log(err))
  
    }
    image && !imageUrl.current.src ? getUserImage(image):null

    return ()=>{
      controller.abort();
    }
  },[])
  
  return (
    <nav className="navbar">
        {image? 
        <img ref={imageUrl} className="user-image" src={null} alt="known-user" />:
        <i className="fa-solid fa-user"></i>
        }
        <div className="known-user-info">
            <p className="heading">{heading}</p>
            <p className="message">{sub_heading}</p>
        </div>
        <div className="navbar-features">
            <i className="fa-solid fa-search"></i>
            <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
    </nav>
  )
cv
}

export default Navbar;