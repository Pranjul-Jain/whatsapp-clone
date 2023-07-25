import React,{useRef,useEffect} from 'react'
import sampleUserImg from "../../assets/images/sample_user.jpg"
import axios from "axios"

const GroupUserCard = ({setSelectedCards,selectedCards,...props}) => {
  const imageUrl = useRef("")
  const mounted = useRef(false)

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
    <div onClick={addCard} id={props.id} className={"members-user-card"+" "+props.display} receiver_id={props.receiver_id}>
        {props.image? 
        <img ref={imageUrl} className="user-image" src={props.imageurl} alt="user image" />:
        <i className="fa-solid fa-user"></i>
        }
        <div className="members-heading">{props.name}</div>
    </div>
  )

  function addCard(){
    selectedCards.indexOf(props.id) === -1
    ?setSelectedCards(prevState=>[...prevState,props.id])
    :null
  }

}

export default GroupUserCard