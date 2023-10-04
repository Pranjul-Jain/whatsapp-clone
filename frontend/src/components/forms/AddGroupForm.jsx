import React,{useRef,useState} from 'react'
import axios from "axios"

axios.defaults.withCredentials = true

const AddGroupForm = ({
  getUsers,
  selectedCards,
  setToggleGroupForm,
  setSelectedCards,
  toggleForm,
  user_id
}) => {
  const errorMsg = useRef()
  const [image,setImage] = useState("")

  return (
    <form className="add-members-section gr-sec" id="group-details" onSubmit={createGroup}>
      <h1 className="heading"><button style={{outline:"none"}} onClick={()=>{setToggleGroupForm(false)}}><i className="fa-sharp fa-solid fa-arrow-left"></i></button> New group</h1>
      <label className="group-image-upload">
          {image?<img className='group-image' src={image} ></img>:
          <i className="fa-solid fa-user-group">
          <div className="icon-display">
            <i className="fa-solid fa-camera"></i>
            <p>Add group icon</p>
          </div>
          </i>
        } 
        <input name="group-image" type="file" accept='image/*' onChange={createImageurl}/>
      </label>
      <div className='group-input-box'>
        <div className="group-input-frame">
          <input autoComplete='off' className='group-input' defaultValue={""} onChange={inputHandler} onKeyDown={(event)=> event.key.toLowerCase() === "enter"?event.preventDefault():""} type="text" name="group-name"/>
          <p className="group-subject-heading">Group Subject</p>
        </div>
      </div>
      <p className='errormsg' ref={errorMsg}>
      </p>
      <div className='members-footer' id="group-details-footer">
        <button type="submit" className="members-add-button d-none"><i className="fa-solid fa-check"></i></button>
      </div>
    </form>
  )

  async function createGroup(event){
    event.preventDefault();

    if(event.target['group-name'].value.trim().length === 0){
      errorMsg.current = "Please enter group name"
      return
    }

    const formdata = new FormData()
    formdata.append("name",event.target["group-name"].value)
    formdata.append("image",event.target["group-image"].files[0])
    const members = selectedCards.map((data)=>{return {user_id:document.querySelector("#"+data).getAttribute("receiver_id")}})
    members.push({user_id : user_id.current})

    formdata.append("members",JSON.stringify(members))
    
    const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/creategroup",formdata,{
      header:{
        "content-type":"multipart/form-data"
      }
    })

    document.querySelector("#group-details").reset()
    setSelectedCards([])
    if(response){
      inputHandler(null)
      setToggleGroupForm(false)
      toggleForm();
      setImage("");
      getUsers(user_id.current)
    }else{
      errorMsg.current = "Some error occured try again"
    }

    
  }

  function inputHandler(event){
    const groupHeading = document.querySelector(".group-subject-heading")
    const footer = document.querySelector("#group-details-footer")

    if(event && event.target.value.trim()){
        footer.style.opacity = "1";
        footer.querySelector(".members-add-button").style.display = "block"
        if(!groupHeading.classList.contains("upandown")){
          groupHeading.classList.add("upandown")
        }
    }else{
      footer.style.opacity = "0";
      footer.querySelector(".members-add-button").style.display = "none"
      if(groupHeading.classList.contains("upandown")){
        groupHeading.classList.remove("upandown")
      }
    }
  }

  function createImageurl(event){
    event.preventDefault();
    const file = event.target.files[0];
    const src = (window.URL) ? window.URL.createObjectURL(file) : window.webkitURL.createObjectURL(file);
    setImage(src);
  }

}

export default AddGroupForm