/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  Grid,
  TextField,
  FormControlLabel,
  Paper,
  Button,
} from "@material-ui/core";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import GroupsIcon from "@mui/icons-material/Groups";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { URL_CHANGE, TOKEN } from "../utils/Constants";

export const AccountFragment = () => {
  const [accessToken, setAccessToken] = useState(
    null
  );
  
  useEffect(() => {
    setAccessToken(window.localStorage.getItem(TOKEN));
  }, []);

  return (
    <div className="account-fragment">
      {accessToken !== null && accessToken !== "" && accessToken !== "null" ? (
        <InfoPage mSetAccessToken={setAccessToken} />
      ) : (
        <LoginPage mSetAccessToken={setAccessToken} />
      )}
    </div>
  );
};

const LoginPage = ({ mSetAccessToken }) => {
  const [loginMessage, setLoginMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setDirections("left");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setDirections("right");
  };
  const [direction, setDirections] = useState("left");

  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState(null);
  const [checked, setChecked] = React.useState(true);

  return (
    <div className="login-page">
      <p className="header-text-1">Bạn chưa có tài khoản?</p>
      <p className="header-text-2">
        Vui lòng đăng nhập để sử dụng chức năng này
      </p>
      <img
        className="fb-login-btn"
        src={require("../assets/loginFbButton.png")}
      />
      <p className="header-text-3">Bạn đã có tài khoản?</p>
      <p
        className="move-to-login-phone-text"
        onClick={() => {
          handleOpen();
        }}
      >
        Đăng nhập ngay?
      </p>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Slide direction={direction} in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              backgroundColor: "#1f1f2a",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="close-icon-area"
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon
                className="close-icon"
                style={{ width: "35px", height: "35px", zIndex: 1 }}
              />
            </div>
            <p className="header-text-1">Đăng nhập</p>
            <div>
              <Paper style={{ padding: 20 }}>
                <Grid
                  container
                  spacing={3}
                  direction={"column"}
                  justify={"center"}
                  alignItems={"center"}
                >
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      type={"number"}
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        console.log(phone);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type={"password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        console.log(password);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => {
                            setChecked(event.target.checked);
                          }}
                          label={"Keep me logged in"}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      }
                      label="Keep me logged in"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      style={{
                        backgroundColor: "rgb(255, 70, 109)",
                        color: "white",
                      }}
                      onClick={() => {
                        const postLoginRequest = async () => {
                          try {
                            const loginResponse = await fetch(
                              URL_CHANGE + "/scp/login",
                              {
                                method: "post",
                                headers: new Headers({
                                  "Content-Type": "application/json",
                                }),
                                body: JSON.stringify({
                                  phone: phone,
                                  password: password,
                                }),
                              }
                            );
                            const jsonLoginRequest = await loginResponse.json();
                            console.log(
                              "Login request: " +
                                String(jsonLoginRequest.message)
                            );
                            setLoginMessage(jsonLoginRequest.message);
                            if (String(jsonLoginRequest.success) === "true") {
                              window.localStorage.setItem(
                                TOKEN,
                                jsonLoginRequest.data.accessToken
                              );
                              mSetAccessToken(
                                window.localStorage.getItem(TOKEN)
                              );
                              console.log(window.localStorage.getItem(TOKEN));
                            }
                          } catch (loginRequestError) {
                            console.error(loginRequestError);
                          }
                        };
                        postLoginRequest();
                      }}
                    >
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              <p style={{color: 'red', textAlign: 'center'}}>{loginMessage}</p>
            </div>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

const InfoPage = ({ mSetAccessToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const getUserProfile = async () => {
    try {
      const response = await fetch(URL_CHANGE + "/scp/user/profile", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + window.localStorage.getItem(TOKEN),
          "Content-Type": "application/json",
        }),
      });
      const json = await response.json();
      console.log("User-info fetched: " + json.success);
      setUserProfile(json);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Get user profile finished");
    }
  };
  useEffect(() => {
    if (
      window.localStorage.getItem(TOKEN) != null &&
      window.localStorage.getItem(TOKEN) !== ""
    ) {
      getUserProfile();
    }
  }, []);

  const InfoPageData = () => {
    return (
      <div style={{ display: "flex" }}>
        <div className="left-page">
          <img className="avatar" src={userProfile.data.userInfo.avatar} />
          <p className="username">{userProfile.data.userInfo.shopName}</p>
          <p className="phone">{userProfile.data.userInfo.phone}</p>
          <div className="info-area">
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <div className="info-area-item">
                <LiveTvIcon className="info-icon" />
                <p className="info-data">{userProfile.data.followTotal}</p>
              </div>
              <p className="info-data-label">Đang theo dõi</p>
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <div className="info-area-item">
                <GroupsIcon className="info-icon" />
                <p className="info-data">{userProfile.data.followerTotal}</p>
              </div>
              <p className="info-data-label">Người theo dõi</p>
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <div className="info-area-item">
                <ThumbUpOffAltIcon className="info-icon" />
                <p className="info-data">{userProfile.data.likeTotal}</p>
              </div>
              <p className="info-data-label">Yêu thích</p>
            </div>
          </div>
        </div>
        <div className="divided-line"></div>
        <div className="right-page">
          <p
            style={{
              marginTop: 100,
              color: "white",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Tùy chọn
          </p>
          <div className="option-button">
            <div
              className="info-area-item"
              onClick={() => {
                const postLogoutRequest = async () => {
                  try {
                    const logoutResponse = await fetch(
                      URL_CHANGE + "/scp/logout",
                      {
                        method: "post",
                        headers: new Headers({
                          Authorization:
                            "Bearer " + window.localStorage.getItem(TOKEN),
                          "Content-Type": "application/json",
                        }),
                      }
                    );
                    const jsonLogoutRequest = await logoutResponse.json();
                    console.log(
                      "Logout request: " + String(jsonLogoutRequest.message)
                    );
                    if (String(jsonLogoutRequest.success) === "true") {
                      window.localStorage.setItem(TOKEN, null);
                      mSetAccessToken(null);
                      console.log(window.localStorage.getItem(TOKEN));
                    }
                  } catch (logoutRequestError) {
                    console.error(logoutRequestError);
                  }
                };
                postLogoutRequest();
              }}
            >
              <LogoutIcon className="info-icon" />
              <p className="info-option-text">Đăng xuất</p>
              <ArrowForwardIosIcon className="info-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (userProfile != null) {
    return <InfoPageData />;
  }
};
