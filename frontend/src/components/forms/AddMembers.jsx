import React,{useRef,useState,useEffect} from 'react'
import GroupUserCard from '../user/GroupUserCard'
import AddGroupForm from './AddGroupForm'

const AddMembers = ({
    getUsers,
    allUsers,
    user_id
}) => {

  const [member,setMember] = useState("")
  const [selectedCards, setSelectedCards] = useState([])
  const [toggleGroupForm,setToggleGroupForm] = useState(false)

  useEffect(()=>{
    const groupDetails = document.querySelector("#group-details");
    if(toggleGroupForm){
        groupDetails.style.left="0";
    }else{
        groupDetails.style.left="-100%";
    }
  },[toggleGroupForm])
  
  return (
    <div className="add-members-section">
    <h1 className="heading"><button style={{outline:"none"}} onClick={toggleForm}><i className="fa-sharp fa-solid fa-arrow-left"></i></button> Add group participants</h1>
        <div className="members-search">
            <div className='sm-group-user-profiles'>
                {
                    selectedCards.length >= 1 && selectedCards.map((data,index)=>{
                        const cardInfo = document.querySelector("#"+data)

                        return (
                            <div className="sm-group-user-card" key={"sm-group-user-profiles-"+(index+1)}>
                                {cardInfo.querySelector(".user-image")?<img className="sm-user-image" src={cardInfo.querySelector(".user-image").src} />:<i className="fa-solid fa-user"></i>}
                                <p className="sm-members-heading">{cardInfo.querySelector(".members-heading").innerText} <button className="sm-cross-button" onClick={()=>setSelectedCards(prevState=>prevState.filter((data=>data !== cardInfo.id)))}>X</button></p>
                            </div>
                        )
                    })
                }
            </div>
            <input className='members' defaultValue={""} type="text" placeholder='Type contact name' name="members" onChange={(e)=>{setMember(e.target.value)}} />
        </div>
        <div className="members-user-profiles">
            {
                allUsers.map((data,index)=>{
                    if(data.receiver_id && (!member || (data.name.match(new RegExp(member.trim(),"i"))))){
                        
                        let display="d-grid";
                        if((selectedCards.length >=1 && selectedCards.indexOf("group-user-card-"+(index)) !== -1)){
                            display = "d-none";
                        }

                        return <GroupUserCard selectedCards={selectedCards} id={"group-user-card-"+(index)} display={display} card_index={index} setSelectedCards={setSelectedCards} name={data.name} receiver_id={data.receiver_id} key={"group-user-card-key-"+(index)} imageurl={null} image={data.receiver_id__upload_image}/>
                    }
                })
            }
        </div>
        {selectedCards.length >=1 && <div className="members-footer">
            <button className="members-add-button" onClick={()=>setToggleGroupForm(true)}><i className="fa-sharp fa-solid fa-arrow-right"></i></button>
        </div>
        }

        <AddGroupForm getUsers={getUsers} setSelectedCards={setSelectedCards} setToggleGroupForm={setToggleGroupForm} toggleForm={toggleForm} selectedCards={selectedCards} user_id={user_id} />
    </div>
  )

  function toggleForm(){
    document.querySelector(".add-members-section").style.left="-100%"
    setSelectedCards([])
  }
}

export default AddMembers