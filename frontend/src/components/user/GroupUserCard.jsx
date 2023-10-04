import React,{useRef,useEffect,useState} from 'react'
import sampleUserImg from "../../assets/images/sample_user.jpg"
import axios from "axios"

const GroupUserCard = ({setSelectedCards,selectedCards,...props}) => {
  const [imageUrl,setImageurl] = useState("")
  const [mounted,setMounted] = useState(false)
  const [currentImg,setcurrentImg] = useState("")

  if(currentImg && props.image!=currentImg){
    getUserImage(props.image,null);
  }

  useEffect(()=>{
    const controller = new AbortController();

    props.image && !props.imageurl && (!mounted)  ? getUserImage(props.image,controller):null

    setMounted(true);

    return ()=>{
      controller.abort();
    }
  },[])
  
  return (
    <div onClick={addCard} id={props.id} className={"members-user-card"+" "+props.display} receiver_id={props.receiver_id}>
        {props.image? 
        <img className="user-image" src={imageUrl} alt="user image" />:
        <i className="fa-solid fa-user"></i>
        }
        <div className="members-heading">{props.name}</div>
    </div>
  )

  async function getUserImage (image,controller){
  
    await axios.get(import.meta.env.VITE_SERVER_URL + "/getuserimage/",{
      responseType:"arraybuffer",
      params:{
        image
      },
      headers:{
        signal:controller?controller.signal:null,
      }
    }).then(res=>{
      
      const base64Image = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      if(base64Image)
      setImageurl(`data:${res.headers['content-type']};base64,${base64Image}`)
      else
      setImageurl(sampleUserImg)

      setcurrentImg(props.image)

    }).catch(err=>console.log(err))

  }


  function addCard(){
    selectedCards.indexOf(props.id) === -1
    ?setSelectedCards(prevState=>[...prevState,props.id])
    :null
  }

}

export default GroupUserCard