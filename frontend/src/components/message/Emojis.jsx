import React,{useEffect,useRef} from 'react'

const Emojis = ({
    chatboxRef,emojiState, setEmojiState
}) => {
  const emojiBack = useRef();
  useEffect(()=>{
    const copyEmoji = (event)=>{
        chatboxRef.current.value += " "+event.target.innerText
    }
    const allemojis = document.querySelectorAll(".emoji-all>span")

    if(allemojis){
        allemojis.forEach((element)=>{
            element.addEventListener("click",copyEmoji)
        })
    }
    return ()=>{
        allemojis?allemojis.forEach((element)=>{
            element.removeEventListener("click",copyEmoji)
        }):null
    }
  },[])

  useEffect(()=>{
    emojiState==="open"?emojiBack.current.style.display="grid":emojiBack.current.style.display="grid";
    if (emojiState === "open") {
      emojiBack.current.style.height = "11rem";
      emojiBack.current.style.opacity = "1";
    } else {
      emojiBack.current.style.height = "0"+"px";
      emojiBack.current.style.opacity = "0";
    }
  
    emojiBack.current.style.transition = "all 0.2s ease-in-out";
  },[emojiState])


  return (
    <div className="emoji-background" ref={emojiBack}>
          {/* <nav className="emoji-nav">
            <ul>
              <li><i className="fa-sharp fa-solid fa-face-smile"></i></li>
            </ul>
          </nav> */}
          <div className="emoji-all">
            <span>😄</span><span>😀</span><span>😧</span><span>😨</span><span>😠</span><span>🥹</span><span>😂</span>
            <span>🤣</span><span>🥲</span><span>😊</span><span>😇</span><span>🙂</span><span>🙃</span><span>😉</span>
            <span>😌</span><span>😍</span><span>🥰</span><span>😘</span><span>😚</span><span>😝</span><span>🤪</span><span>🧐</span><span>🤓</span><span>😎</span><span>🥸</span>
            <span>🤩</span><span>🥳</span><span>😏</span><span>😒</span><span>😞</span><span>😔</span><span>😣</span><span>😫</span>
            <span>🥺</span><span>😡</span><span>🤬</span><span>😳</span><span>🥶</span><span>😈</span><span>👿</span><span>😺</span>
            <span>🙀</span><span>😿</span><span>👍</span><span>👎</span><span>🤛</span><span>☝️</span><span>🤏</span><span>🤌</span><span>👌</span>
          </div>
    </div>
  )
}

export default Emojis