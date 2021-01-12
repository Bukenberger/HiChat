import React, { useReducer, useEffect, Fragment } from "react";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import theme from "../../theme";
import ChatBubbleList from "../Chat/ChatBubbleList";
import TopBar from "../TopBar/TopBar";
import logo from "../../images/chat-icon2.png";
import userPicture from "../../images/user.png";
import "./App.css";

const Project2Component = () => {
  const initialState = {
    messages: [],
    rooms: [],
    onlineUsers: [],
    nameStatus: "",
    chatName: "",
    roomName: "",
    typingMsg: "",
    message: "",
    showjoinfields: true,
    alreadyexists: false,
    isTyping: false,
    isOpen: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onWelcome = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ showjoinfields: false, alreadyexists: false });
  };

  const onNameExists = (dataFromServer) => {
    setState({ nameStatus: dataFromServer.text });
  };

  // handler for user typing
  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "", message: "" });
  };

  const onDisplayRooms = (dataFromServer) => {
    setState({ rooms: dataFromServer });
  };

  const onDisplayOnlineUsers = (dataFromServer) => {
    setState({ onlineUsers: dataFromServer });
  };

  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serverConnect = () => {
    // connect to server
    const socket = io.connect("localhost:5000", { forceNew: true });
    // const socket = io();
    socket.on("displayrooms", onDisplayRooms);
    socket.on("nameexists", onNameExists);
    socket.on("welcome", onWelcome);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("displayonline", onDisplayOnlineUsers);
    setState({ socket: socket });
  };

  // generic handler for all messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({ messages: messages });
  };

  // button click handler for join button
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value });
  };

  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };

  const handleOpenDialog = () => {
    state.socket.emit("refreshuserlist");
    setState({ isOpen: true });
  };
  const handleCloseDialog = () => setState({ isOpen: false });

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // only first byte
    }
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false });
    }
  };

  const handleRadioButtons = (e) => {
    setState({ roomName: e.target.value });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <TopBar viewDialog={handleOpenDialog} display={state.showjoinfields} />
        <Dialog
          open={state.isOpen}
          onClose={handleCloseDialog}
          style={{ margin: 20 }}
        >
          <DialogTitle style={{ textAlign: "center" }}>Who's On?</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                {state.onlineUsers.map((user, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        <img
                          src={userPicture}
                          alt="user"
                          style={{
                            backgroundColor: user.colour,
                            borderRadius: 25,
                            marginRight: "15px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.name} is in {state.roomName}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
      {state.showjoinfields && (
        <Fragment>
          <div className="logo-div">
            <img src={logo} alt="chat logo" />
          </div>
          <Typography color="primary" style={{ textAlign: "center" }}>
            Sign In
          </Typography>
          <Card className="join-card">
            <CardContent>
              <TextField
                onChange={onNameChange}
                placeholder="Chat Name"
                required
                value={state.chatName}
                error={state.nameStatus !== ""}
                helperText={state.nameStatus}
              />
            </CardContent>
          </Card>
          <Card className="join-card">
            <CardContent>
              <Typography color="primary">
                Join Existing or Enter Room Name
              </Typography>
              <FormControl>
                <RadioGroup
                  aria-label="room"
                  name="rooms"
                  value={state.roomName}
                  onChange={handleRadioButtons}
                  defaultChecked={0}
                >
                  {state.rooms.map((room, idx) => {
                    return (
                      <FormControlLabel
                        key={idx}
                        value={room}
                        control={<Radio />}
                        label={room}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <br />
              <TextField
                onChange={onRoomChange}
                placeholder="Room Name"
                required
                value={state.roomName}
                helperText={"enter a new room name"}
              />
            </CardContent>
          </Card>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "3%" }}
            onClick={() => handleJoin()}
            disabled={state.chatName === "" || state.roomName === ""}
          >
            Join
          </Button>
        </Fragment>
      )}
      {!state.showjoinfields && (
        <Card>
          <CardContent>
            <div className="chatList">
              <ChatBubbleList
                msg={state.messages}
                client={state.chatName}
              ></ChatBubbleList>
            </div>
            <br />
            <TextField
              style={{ width: "100%" }}
              onChange={onMessageChange}
              placeholder="Enter a message..."
              autoFocus={true}
              value={state.message}
              onKeyPress={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
            />
            <Typography color="primary">{state.typingMsg}</Typography>
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
};

export default Project2Component;
