import React,{useEffect,useRef} from 'react'

const Chatbox = ({
  chatboxRef,
  emojiState, 
  setEmojiState,
  chatsocket,
  ...props}
) => {
  useEffect(()=>{
    chatsocket.onmessage = (textdata)=>{
      textdata = JSON.parse(textdata.data)

      props.setMessages(prevState=>[
        ...prevState,
        {"user_id":textdata.sender_id,"message":textdata.message,"message_timestamp":textdata.message_timestamp}
      ])
      document.querySelector("#"+props['aria-label']+" .message").innerText = textdata.message.length>45 
      ?textdata.message.replace("\n"," ").substring(0,45)+"...":textdata.message
      
      const date = new Date(textdata.message_timestamp);
      document.querySelector("#"+props['aria-label']+" .time").innerText = date.getHours()+":"+date.getMinutes()
    }

    chatsocket.onclose = (event)=>{
      alert("this user connection has been closed unexpectedly")
    }
  },[chatsocket])

  useEffect(()=>{
    emojiState==="open"
    ?document.querySelector("#chatbox-smiley").style.color="rgb(32, 153, 113)"
    :document.querySelector("#chatbox-smiley").style.color="rgba(155, 152, 152, 0.685)"

  },[emojiState])

  useEffect(()=>{
    const chatboxInput = document.querySelector(".chatbox-input");
    if(chatboxInput){
      chatboxInput.style.height = "auto";
      chatboxInput.style.height = "40"+"px";
    }
  },[])

  return (
    <div className="chatbox">
        {emojiState==="open"?<i className="fa-solid fa-xmark" style={{transition:"all 0.2s ease-in-out"}} onClick={()=>setEmojiState("close")}></i>:""}
        <i className="fa-solid fa-face-grin-wide" id="chatbox-smiley" onClick={()=>{emojiState==="close"?setEmojiState("open"):null}}></i>
        <i className="fa-sharp fa-solid fa-paperclip"></i>
        <textarea ref={chatboxRef} autoComplete="off" className="chatbox-input" name="message" type="text" placeholder='Type a message' onKeyDown={handleKey} />
        <i className="fa-solid fa-microphone"></i>
    </div>
  )

  function sendMessage(message){
    if(String(message).trim()){
      chatsocket.send(JSON.stringify({
        "message":message.trim(),
        "sender_id":props.user_id
      }))
    }
  }

  function handleKey(event){
    const chatboxInput = document.querySelector(".chatbox-input");

    if(event.keyCode === 13 && !event.shiftKey){
      sendMessage(event.target.value)
      event.target.value = "";
      chatboxInput.style.height = "auto";
      chatboxInput.style.height =  "40"+"px";
    }
    else{
      chatboxInput.style.height = "auto";
      if (chatboxInput.scrollHeight > 57) {
          chatboxInput.style.height = chatboxInput.scrollHeight + "px";
      }else{
          chatboxInput.style.height =  "40"+"px";
      }
    }
  }
}

export default Chatbox;