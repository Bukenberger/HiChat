import React from "react";
import "../App/App.css";

import { Card, CardContent } from "@material-ui/core";

const ChatMsg = (props) => {
  return (
    <Card
      style={{
        backgroundColor: props.msg.colour,
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
        width: "70%",
        marginBottom: "-1em",
        borderRadius: "10px",
        left: props.client === props.msg.from ? "34%" : "-5%",
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

export default ChatMsg;
