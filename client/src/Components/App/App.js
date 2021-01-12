import React, { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";

// Components
import Home from "../Home/Home";
import Modal from "../Modal/Modal";
import ChatInputBox from "../ChatInputBox/ChatInputBox";
import TopBar from "../TopBar/TopBar";

// Styling theme
import theme from "../../theme";

// CSS
import "./App.css";

const App = () => {
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

  // User name validation
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
    setState({ typingMsg: "", isTyping: false });
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
  const handleNameChange = (e) => {
    setState({ chatName: e.target.value });
  };

  const handleRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };

  const handleOpenDialog = () => {
    state.socket.emit("refreshuserlist");
    setState({ isOpen: true });
  };

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
      setState({ message: "" });
    }
  };

  const handleRadioButtons = (e) => {
    setState({ roomName: e.target.value });
  };

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

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <TopBar viewDialog={handleOpenDialog} display={state.showjoinfields} />
        <Modal props={state} closeFunc={() => setState({ isOpen: false })} />
      </div>
      {state.showjoinfields && (
        <Home
          props={state}
          handleRadioButtons={handleRadioButtons}
          handleNameChange={handleNameChange}
          handleRoomChange={handleRoomChange}
          handleJoin={handleJoin}
        />
      )}
      {!state.showjoinfields && (
        <ChatInputBox
          props={state}
          onMessageChange={onMessageChange}
          handleSendMessage={handleSendMessage}
        />
      )}
    </MuiThemeProvider>
  );
};

export default App;
