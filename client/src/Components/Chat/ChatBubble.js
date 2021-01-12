import React, { useEffect, useRef } from "react";
import { ListItem } from "@material-ui/core";
import ChatMsg from "./ChatMsg";

const ChatBubble = (props) => {
  const chatRef = useRef(null);
  useEffect(() => {
    chatRef.current.scrollIntoView(true);
  }, []);
  return (
    <div>
      <ListItem
        ref={chatRef}
        style={{ textAlign: "left", marginBottom: "5px" }}
      >
        <ChatMsg msg={props.msg} client={props.client} />
      </ListItem>
      <p></p>
    </div>
  );
};
export default ChatBubble;
