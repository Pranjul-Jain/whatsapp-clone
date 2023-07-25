import React,{useEffect,useState,useRef} from 'react'
import Navbar from "./Navbar"
import Chatbox from "./Chatbox"
import MessageDisplay from './MessageDisplay'
import Emojis from './Emojis'

const MessageSection = (props) => {
  const mounted = useRef(false)
  const [chatsocket, setChatsocket] = useState(null)
  const [messages,setMessages] = useState(props.messages)
  const [emojiState, setEmojiState] = useState("close")
  const chatboxRef = useRef();

  useEffect(()=>{
    const connectChat = async ()=>{
      const socket = new WebSocket("ws://"+ import.meta.env.VITE_HOST + "/socket-server/"+(props.group?props.receiver_id:props.user_id+props.receiver_id)+"/")
      setChatsocket(socket)
    }

    if(!mounted.current){
      connectChat()
      mounted.current =true
    }

    return ()=>{
      chatsocket?chatsocket.close():null;
    }
    
  },[])

  useEffect(()=>{
    props.isAuthenticated?null:chatsocket?chatsocket.close():null;
  },[props.isAuthenticated])

  return (
    <div className={"messages-section "+props.className}>
        <Navbar heading={props.heading} sub_heading={props.sub_heading} image={props.image} />
        <MessageDisplay group={props.group} key={"message-display"+new Date().getTime()} messages={messages} user_id={props.user_id} />  
        <Emojis chatboxRef={chatboxRef} emojiState={emojiState} setEmojiState={setEmojiState} />
        {chatsocket?<Chatbox group={props.group} chatboxRef={chatboxRef} emojiState={emojiState} setEmojiState={setEmojiState} className={props.className} aria-label={props['aria-label']} user_id={props.user_id} chatsocket={chatsocket} setMessages={setMessages} receiver_id={props.receiver_id}/>:null}
    </div>
  )
}

export default MessageSection