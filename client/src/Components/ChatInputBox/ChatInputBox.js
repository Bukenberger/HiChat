import React from "react";
import { TextField, Typography, Card, CardContent } from "@material-ui/core";

// Components
import ChatBubbleList from "../ChatBubbleList/ChatBubbleList";

// CSS
import "./ChatInputBox.css";

const ChatInputBox = (props) => {
  const { messages, chatName, message, typingMsg } = props.props;

  return (
    <Card>
      <CardContent>
        <div className="chatList">
          <ChatBubbleList msg={messages} client={chatName}></ChatBubbleList>
        </div>
        <br />
        <TextField
          style={{ width: "100%" }}
          onChange={props.onMessageChange}
          placeholder="Enter a message..."
          autoFocus={true}
          value={message}
          onKeyPress={(e) =>
            e.key === "Enter" ? props.handleSendMessage() : null
          }
        />
        <Typography color="primary">{typingMsg}</Typography>
      </CardContent>
    </Card>
  );
};

export default ChatInputBox;
