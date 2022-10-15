/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";
import io from 'socket.io-client';
import styles from "./App.css";
import useComment from "./utils/hooks/useComment";

import { LiveFragment } from "./fragments/LiveFragment";
import { AccountFragment } from "./fragments/AccountFragment";

const App = () => {
  const [value, setValue] = useState(0);
  const {comment, setComment} = useComment("id");

  return (
    <div className="app-screen">
      <NavBar className="nav-bar" mValue={value} mSetValue={setValue} />
      {value === 0 ? <LiveFragment mAccessToken="" /> : <AccountFragment />}
    </div>
  );
};

const NavBar = ({ mValue, mSetValue }) => {
  const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
    color: white;
    &.Mui-selected {
      color: #ff466d;
    }
  `);
  return (
    <BottomNavigation
      className="nav-bar"
      style={{ backgroundColor: "black", height: "10vh" }}
      showLabels
      value={mValue}
      onChange={(e, newValue) => {
        mSetValue(newValue);
      }}
    >
      <BottomNavigationAction label="Live" icon={<LiveTvIcon />} />
      <BottomNavigationAction label="Account" icon={<PermIdentityIcon />} />
    </BottomNavigation>
  );
};

export default App;