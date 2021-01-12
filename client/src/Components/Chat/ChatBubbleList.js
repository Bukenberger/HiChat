import React from "react";
import { List } from "@material-ui/core";
import ChatBubble from "./ChatBubble";

const ChatBubbleList = (props) => {
  let messages = props.msg.map((msg, idx) => {
    return <ChatBubble key={idx} msg={msg} client={props.client} />;
  });
  return (
    <List style={{ maxHeight: "100%", overflow: "auto" }}>{messages}</List>
  );
};
export default ChatBubbleList;
