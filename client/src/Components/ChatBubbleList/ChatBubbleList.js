import React from "react";
import { List } from "@material-ui/core";

// Components
import ChatBubble from "../ChatBubble/ChatBubble";

// CSS
import "./ChatBubbleList.css";

const ChatBubbleList = (props) => {
  let messages = props.msg.map((msg, idx) => {
    return <ChatBubble key={idx} msg={msg} client={props.client} />;
  });
  return (
    <List style={{ maxHeight: "100%", overflow: "auto" }}>{messages}</List>
  );
};

export default ChatBubbleList;
