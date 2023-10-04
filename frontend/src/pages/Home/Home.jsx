import React,{useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import UserHeader from '../../components/user/UserHeader'
import UserSearchbar from '../../components/user/UserSearchbar'
import KnownUserCard from '../../components/user/KnownUserCard'
import AddMemberForm from '../../components/forms/AddMemberForm'
import AddMembers from '../../components/forms/AddMembers';
import MessageSection from '../../components/message/MessageSection';
import axios from "axios"

axios.defaults.withCredentials = true;

const Home = ({
  isAuthenticated,
  setAuthenticated,
  user_id
}) => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([])
  const [currentUser,setCurrentUser] = useState(-1)


  useEffect(()=>{
    const controller = new AbortController()

    const getAuthenticateData = async ()=> {
     const response =  await axios.get(import.meta.env.VITE_SERVER_URL + "/authenticate/",{
      headers:{
        signal:controller.signal
      },
      withCredentials: true
    }).then(res=> res).catch(err=>err)
     const data = await response.data;
     
      if(data){
        if(data.message === "authorized"){
          setAuthenticated(true)
          user_id.current = data.user_id
        }else{
          navigate("/login")
        }
      }else{
        navigate("/login")
      }
    }
    
    !isAuthenticated?getAuthenticateData(): user_id.current ?getUsers(user_id.current,controller):null;

    return ()=>{
      controller.abort()
    }
  },[isAuthenticated])


  return (
    <div className="whatsapp-gridbox">
        <div className="user-section">
          <UserHeader allUsers={allUsers} setAuthenticated={setAuthenticated} isAuthenticated={isAuthenticated} user_id={user_id} />
          <UserSearchbar/>
          <div className="known-user-profiles">
            {
              allUsers && allUsers.length >= 1 && allUsers.map((data,index)=>{
                if(data.receiver_id)
                return (<KnownUserCard currentUser={currentUser} setCurrentUser={setCurrentUser} newimage={true} image={data.receiver_id__upload_image} imageurl={null} name={data.name} time={data.messages.length > 1?data.messages.at(-1).message_timestamp:null} message={data.messages.length > 1?data.messages.at(-1).message:"hi"} id={"known-user-card-"+(index)} key={index+1}/>)
                else{
                return (<KnownUserCard currentUser={currentUser} setCurrentUser={setCurrentUser} newimage={true} image={data.upload_image} imageurl={null} name={data.name} time={data.messages.length > 1?data.messages.at(-1).message_timestamp:null} message={data.messages.length > 1?data.messages.at(-1).message:"hi"} id={"known-user-card-"+(index)} key={index+1} />)
                }
            })
            }
          </div>
          <AddMemberForm getUsers={getUsers} user_id={user_id} />
          {allUsers && allUsers.length >= 1 && <AddMembers getUsers={getUsers} user_id={user_id} allUsers={allUsers} />}
        </div>
        {
          allUsers && allUsers.length >= 1 && allUsers.map((data,index)=>{
            if(data.receiver_id)
            return <MessageSection isAuthenticated={isAuthenticated} image={data.receiver_id__upload_image} aria-label={"known-user-card-"+index} heading={data.name} sub_heading={"click here for contact info"} messages={data.messages} user_id={user_id.current} receiver_id={data.receiver_id} className={index==currentUser?"d-grid":""} key={"message-section-"+index+1} group={false} />
            else{ 
              return <MessageSection isAuthenticated={isAuthenticated} image={data.upload_image} aria-label={"known-user-card-"+index} heading={data.name} sub_heading={"click here for contact info"} messages={data.messages} user_id={user_id.current} receiver_id={data._id} className={index==currentUser?"d-grid":""} key={"message-section-"+index+1} group={true} />
            }
          })
        }
    </div>
  )

  async function getUsers(user_id,controller=null){

    const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/getusers/"+user_id,(controller?{
      headers :controller?{
        signal:controller.signal
      }:{},
      withCredentials:true
    }:{})).then(res=>res).catch(err=>console.log(err))

    if(res){
      const data = await res.data;
      setAllUsers(data.users);
    }
  }

}

export default Home