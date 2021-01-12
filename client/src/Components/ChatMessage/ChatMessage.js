import React from "react";
import { Card, CardContent } from "@material-ui/core";

// CSS
import "../App/App.css";

const ChatMessage = (props) => {
  return (
    <Card
      style={{
        backgroundColor: props.msg.colour,
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
        width: "70%",
        marginBottom: "-1em",
        borderRadius: "10px",
        left: props.client === props.msg.from ? "30%" : "-1%",
        color: "white",
      }}
    >
      <CardContent>
        <span
          style={{
            fontSize: "smaller",
            fontWeight: "bold",
          }}
        >
          Room: {props.msg.room}
        </span>
        <br />
        <span
          style={{
            fontSize: "smaller",
            fontWeight: "bold",
          }}
        >
          From: {props.msg.from} @ {props.msg.time}
        </span>
        <br />
        <br />
        {props.msg.text}
      </CardContent>
    </Card>
  );
};

export default ChatMessage;
