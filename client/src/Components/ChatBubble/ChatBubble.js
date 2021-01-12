import React, { useEffect, useRef } from "react";
import { ListItem } from "@material-ui/core";

// Components
import ChatMessage from "../ChatMessage/ChatMessage";

// CSS
import "./ChatBubble.css";

const ChatBubble = (props) => {
  const chatRef = useRef(null);
  useEffect(() => {
    chatRef.current.scrollIntoView(true);
  }, []);
  return (
    <div>
      <ListItem ref={chatRef} className="item">
        <ChatMessage msg={props.msg} client={props.client} />
      </ListItem>
      <p></p>
    </div>
  );
};
export default ChatBubble;
