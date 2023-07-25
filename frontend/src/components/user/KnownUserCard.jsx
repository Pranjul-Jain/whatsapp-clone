import React,{useRef,useEffect} from 'react'
import sampleUserImg from "../../assets/images/sample_user.jpg"
import axios from "axios"

const KnownUserCard = (props) => {
  const imageUrl = useRef("")
  const mounted = useRef(false)
  const time = props.time?new Date(props.time):null;

  useEffect(()=>{
    const controller = new AbortController();

    const getUserImage = async (image)=>{
      mounted.current = true
      await axios.get(import.meta.env.VITE_SERVER_URL + "/getuserimage/",{
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

    props.image && !props.imageurl && !mounted.current  ? getUserImage(props.image):null

    return ()=>{
      controller.abort();
    }
  },[])
  
  return (
    <div onClick={()=>selectedCard(props.id)} id={props.id} className="known-user-card" aria-selected="false">
        {props.image? 
        <img ref={imageUrl} className="user-image" src={props.imageurl} alt="known-user" />:
        <i className="fa-solid fa-user"></i>
        }
        <div className="user-info">
            <div className="heading-box">
              <div className="heading">{props.name}</div>
            {time && <div className="time">{time?time.getHours()+":"+time.getMinutes():""}</div>}
            </div>
            {props.message && <div className="message">{props.message && props.message.length>45?props.message.substring(0,45)+"...":props.message}</div>}
        </div>
    </div>
  )

  function selectedCard(currentId){
    if(props.currentUser >=0){
      document.querySelector("#known-user-card-"+props.currentUser).setAttribute("aria-selected","false")
      document.querySelector("#"+currentId).setAttribute("aria-selected","true")
      props.setCurrentUser(parseInt(currentId.slice("known-user-card-".length)))
    }else{
      document.querySelector("#"+currentId).setAttribute("aria-selected","true")
      props.setCurrentUser(parseInt(currentId.slice("known-user-card-".length)))
    }
  }

}

export default KnownUserCard;