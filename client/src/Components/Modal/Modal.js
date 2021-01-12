import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import userIcon from "../../images/user.png";

const Modal = (props) => {
  const { isOpen, onlineUsers, roomName } = props.props;

  return (
    <React.Fragment>
      <Dialog open={isOpen} onClose={props.closeFunc} style={{ margin: 20 }}>
        <DialogTitle style={{ textAlign: "center" }}>Who's On?</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {onlineUsers.map((user, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <img
                        src={userIcon}
                        alt="user"
                        style={{
                          backgroundColor: user.colour,
                          borderRadius: 25,
                          marginRight: "15px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.name} is in {roomName}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Modal;
