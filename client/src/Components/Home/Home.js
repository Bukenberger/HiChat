import React from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";

// Images
import logo from "../../images/chat-icon2.png";

// CSS
import "./Home.css";

const Home = (props) => {
  const { chatName, nameStatus, roomName, rooms } = props.props;

  return (
    <React.Fragment>
      <div className="logo-div">
        <img src={logo} alt="chat logo" />
      </div>
      <Typography color="primary" className="sign-in">
        Sign In
      </Typography>
      <Card className="join-card">
        <CardContent>
          <TextField
            onChange={props.handleNameChange}
            placeholder="Chat Name"
            required
            value={chatName}
            error={nameStatus !== ""}
            helperText={nameStatus}
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
              value={roomName}
              onChange={props.handleRadioButtons}
              defaultChecked={0}
            >
              {rooms.map((room, idx) => {
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
            onChange={props.handleRoomChange}
            placeholder="Room Name"
            required
            value={roomName}
            helperText={"enter a new room name"}
          />
        </CardContent>
      </Card>
      <div className="enter-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.handleJoin()}
          disabled={chatName === "" || roomName === ""}
        >
          Join
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Home;
