/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";

import Carousel from "nuka-carousel";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { Media, Video } from "@vidstack/player-react";
import TextField from "@material-ui/core/TextField";

import { URL_CHANGE, TOKEN } from "../utils/Constants";
import { FormatDate, FormatMs } from "../utils/Format";

export const LiveFragment = () => {
  const mAccessToken = window.localStorage.getItem(TOKEN);

  const trendingListType = {
    url:
      URL_CHANGE +
      "/marketing/campaign/broadcast?newestLimit=10&newestPage=1&type=newest",
    type: "Nổi bật",
  };

  const newestListType = {
    url:
      URL_CHANGE +
      "/marketing/campaign/broadcast?newestLimit=10&newestPage=1&type=newest",
    type: "Mới nhất",
  };

  const topviewsListType = {
    url:
      URL_CHANGE +
      "/marketing/campaign/broadcast?newestLimit=10&newestPage=1&type=top_views",
    type: "Xem nhiều",
  };

  return (
    <div className="live-fragment">
      <CustomCarousel />
      <CategoryItemList />
      <div className="broadcast-list-view">
        <BroadcastItemList
          mListType={trendingListType}
          mAccessToken={mAccessToken}
        />
        <BroadcastItemList
          mListType={newestListType}
          mAccessToken={mAccessToken}
        />
        <BroadcastItemList
          mListType={topviewsListType}
          mAccessToken={mAccessToken}
        />
      </div>
    </div>
  );
};

const CustomCarousel = () => {
  return (
    <Carousel
      defaultControlsConfig={{
        pagingDotsStyle: {
          fill: "white",
        },
      }}
      renderCenterLeftControls={({ previousSlide }) => (
        <ArrowCircleLeftIcon
          className="carousel-icon"
          onClick={() => {
            previousSlide();
          }}
          style={{
            width: 50,
            height: 50,
            marginLeft: "10px",
          }}
        />
      )}
      renderCenterRightControls={({ nextSlide }) => (
        <ArrowCircleRightIcon
          className="carousel-icon"
          onClick={() => {
            nextSlide();
          }}
          style={{
            width: 50,
            height: 50,
            marginRight: "10px",
          }}
        />
      )}
      style={{ height: "100vh", backgroundColor: "black" }}
      autoplay={true}
      autoplayInterval={2000}
      wrapAround={true}
    >
      <img src={require("../assets/banner1.png")} style={{ width: "100%" }} />
      <img src={require("../assets/banner2.png")} style={{ width: "100%" }} />
      <img src={require("../assets/banner3.png")} style={{ width: "100%" }} />
    </Carousel>
  );
};

const CategoryItemList = () => {
  const [categoryList, setCategoryList] = useState([]);

  const getCategory = async () => {
    try {
      const response = await fetch(URL_CHANGE + "/catalog/category");
      const json = await response.json();
      setCategoryList(json.data);
      console.log("Category fetched");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  var categoryItem = categoryList.map((i) => (
    <CategoryItem key={i} mCategory={i} />
  ));

  return (
    <div>
      {categoryList === [] ? (
        <div></div>
      ) : (
        <div className="category-list">{categoryItem}</div>
      )}
    </div>
  );
};

const CategoryItem = ({ mCategory }) => {
  const imageUrl = mCategory.imageUrl;
  const name = mCategory.name;
  return (
    <div className="category-item">
      <img className="category-image" src={imageUrl} />
      <p className="category-title">{name}</p>
    </div>
  );
};

const BroadcastItemList = ({ mListType, mAccessToken }) => {
  const url = mListType.url;
  const type = mListType.type;

  const [broadcastList, setBroadcastList] = useState([]);

  const getBroadcast = async () => {
    try {
      const response = await fetch(url, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + mAccessToken,
          "Content-Type": "application/json",
        }),
      });
      const json = await response.json();
      if (type === "Nổi bật") {
        setBroadcastList(json.data.trending.data);
      } else if (type === "Mới nhất" || type === "Xem nhiều") {
        setBroadcastList(json.data.newest.data);
      }
      console.log(type + " Broadcast fetched: ");
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    getBroadcast();
  }, []);

  var broadcastItem = broadcastList.map((i) => (
    <BroadcastItem key={i} mBroadcast={i} mAccessToken={mAccessToken} />
  ));

  const [page, setPage] = useState(1);
  var newUrl;
  function moveNextPage() {
    if (type !== "Nổi bật") {
      const newPage = page + 1;
      setPage(newPage);

      if (type === "Mới nhất") {
        newUrl =
          URL_CHANGE +
          "/marketing/campaign/broadcast?newestLimit=10&newestPage=" +
          newPage +
          "&type=newest";
      } else if (type === "Xem nhiều") {
        newUrl =
          URL_CHANGE +
          "/marketing/campaign/broadcast?newestLimit=10&newestPage=" +
          newPage +
          "&type=top_views";
      }
      getNewBroadcast(newUrl);
    }
  }
  function movePrevPage() {
    if (page > 1 && type !== "Nổi bật") {
      const newPage = page - 1;
      setPage(newPage);

      if (type === "Mới nhất") {
        newUrl =
          URL_CHANGE +
          "/marketing/campaign/broadcast?newestLimit=10&newestPage=" +
          newPage +
          "&type=newest";
      } else if (type === "Xem nhiều") {
        newUrl =
          URL_CHANGE +
          "/marketing/campaign/broadcast?newestLimit=10&newestPage=" +
          newPage +
          "&type=top_views";
      }
      getNewBroadcast(newUrl);
    }
  }
  const getNewBroadcast = async () => {
    setBroadcastList([]);
    try {
      const response = await fetch(newUrl, {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + mAccessToken,
          "Content-Type": "application/json",
        }),
      });
      const json = await response.json();
      if (type === "Nổi bật") {
        setBroadcastList(json.data.trending.data);
      } else if (type === "Mới nhất" || type === "Xem nhiều") {
        setBroadcastList(json.data.newest.data);
      }
      console.log(type + " Broadcast fetched" + newUrl);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <div>
      {type !== "Nổi bật" ? (
        <h2 style={{ color: "white", textAlign: "center", marginTop: 50 }}>
          {type} - {page}
        </h2>
      ) : (
        <h2 style={{ color: "white", textAlign: "center", marginTop: 50 }}>
          {type}
        </h2>
      )}

      <div className="broadcast-area">
        {type !== "Nổi bật" ? (
          <ArrowCircleLeftIcon
            className="carousel-icon"
            style={{
              width: 50,
              height: 50,
            }}
            onClick={() => {
              movePrevPage();
            }}
          />
        ) : (
          <div></div>
        )}
        <div>
          <div className="broadcast-list">{broadcastItem}</div>
        </div>
        {type !== "Nổi bật" ? (
          <ArrowCircleRightIcon
            className="carousel-icon"
            style={{
              width: 50,
              height: 50,
            }}
            onClick={() => {
              moveNextPage();
            }}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const BroadcastItem = ({ mBroadcast }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const _id = mBroadcast._id;
  const shopName = mBroadcast.shopName;
  const avatarOwner = mBroadcast.avatarOwner;
  const title = mBroadcast.title;
  const description = mBroadcast.description;
  const status = mBroadcast.status;
  const thumbnail = mBroadcast.thumbnail;
  const createdAt = FormatDate(mBroadcast.createdAt);
  var linkLive;
  if (mBroadcast.status === "LIVE") {
    if (mBroadcast.listLive.length > 1) {
      linkLive = mBroadcast.listLive[1].linkLive;
    } else {
      linkLive = mBroadcast.listLive[0].linkLive;
    }
  } else {
    linkLive = mBroadcast.linkVideo;
  }

  return (
    <div className="broadcast-item">
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              backgroundColor: "rgb(50, 50, 50, 0.9)",
            }}
          >
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
              <Media className="media-player">
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
                <Video autoplay className="media-video">
                  <video src={linkLive} preload="none" data-video="0" />
                </Video>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#1f1f2a",
                    width: "40vw",
                  }}
                >
                  <div className="media-user-info">
                    <img className="media-avatar" src={avatarOwner} />
                    <div style={{ marginLeft: "10px" }}>
                      <p className="media-shop-name">{shopName}</p>
                      <p className="media-created-time">{createdAt}</p>
                    </div>
                  </div>
                  <p className="media-title">{title}</p>
                  <p className="media-description">{description}</p>
                  <div class="line"></div>
                  <p className="media-comment-header">Bình luận</p>
                  <CommentItemList mBroadcastId={_id} />
                </div>
              </Media>
            </Slide>
          </Box>
        </Modal>
      </div>
      <div
        className="broadcast-image-view"
        onClick={() => {
          handleOpen();
        }}
      >
        <img className="broadcast-image" src={thumbnail} />
        {status === "LIVE" ? (
          <p className="broadcast-status">TRỰC TIẾP</p>
        ) : (
          <div></div>
        )}
      </div>
      <p className="broadcast-title">{title}</p>
    </div>
  );
};

const CommentItemList = ({ mBroadcastId }) =>{
  // const {comment, setComment} = useComment(mBroadcastId);
  const url =
    URL_CHANGE +
    "/comment?campaignID=" +
    mBroadcastId +
    "&page=1&limit=10&createdTimeSort=-1";
  console.log(url);
  const [commentItemList, setCommentItemList] = useState([]);

  const getComment = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setCommentItemList(json.data.data);
      console.log("Comment fetched: " + commentItemList.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getComment();
    // console.log("csa: ", comment);
  }, []);

  const [page, setPage] = useState(1);
  var newUrl;
  function getMoreComments() {
    var newPage = page + 1;
    setPage(newPage);
    newUrl =
      URL_CHANGE +
      "/comment?campaignID=" +
      mBroadcastId +
      "&page=" +
      newPage +
      "&limit=10&createdTimeSort=-1";

    const getNewComment = async () => {
      try {
        const response = await fetch(newUrl);
        const json = await response.json();
        const commentListApi = json.data.data;
        const commentListNew = commentItemList.concat(commentListApi);

        setCommentItemList(commentListNew);
        console.log("Comment fetched: " + commentItemList.length);
      } catch (error) {
        console.error(error);
      }
    };
    getNewComment();
  }

  const [writeCommentText, setWriteCommentText] = useState(null);
  const handleSubmit = (e) => {
    alert('The value: ' + writeCommentText);
    setWriteCommentText('');                        //To reset the textfield value
    e.preventDefault();
  }

  var commentItem = commentItemList.map((i) => (
    <div>
      {(i === commentItemList[0] && window.localStorage.getItem(TOKEN).length > 10) ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <TextField
            placeholder="Viết bình luận"
            variant="outlined"
            fullWidth
            value={writeCommentText}
            onChange={(event) => {
              setWriteCommentText(event.target.value);
              console.log(writeCommentText);
            }}
            required
            style={{ marginTop: 10, backgroundColor: "white", borderRadius: 100 }}
          />
          <p className="send-comment-btn" onClick={() => {
            setWriteCommentText('');
            const postCommentRequest = async () => {
              try {
                const commentResponse = await fetch(
                  URL_CHANGE + "/comment/viewer",
                  {
                    method: "post",
                    headers: new Headers({
                      Authorization: "Bearer " + window.localStorage.getItem(TOKEN),
                      "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({
                      message: writeCommentText,
                      campaignID: mBroadcastId,
                    }),
                  }
                );
                const jsonLoginRequest = await commentResponse.json();
                console.log(
                  "Comment request: " +
                  String(jsonLoginRequest.message)
                );
              } catch (commentRequestError) {
                console.error(commentRequestError);
              }
            };
            postCommentRequest();
          }}>Send</p>
        </form>
      ) : (
        <div></div>
      )}

      <CommentItem key={i} mComment={i} />
      {i === commentItemList[commentItemList.length - 1] &&
        commentItemList.length % 10 === 0 ? (
        <p
          className="view-more-comments"
          onClick={() => {
            getMoreComments();
          }}
        >
          Xem thêm bình luận
        </p>
      ) : (
        <div></div>
      )}
    </div>
  ));

  return (
    <div>
      {commentItemList === [] ? (
        <div></div>
      ) : (
        <div>
          <div className="comment-list">{commentItem}</div>
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ mComment }) => {
  const createdTime = FormatMs(mComment.createdTime);
  const name = mComment.from.name;
  const avatar = mComment.from.avatar;
  const message = mComment.message;

  return (
    <div>
      <div className="comment-item">
        <img src={avatar} className="comment-avatar" />
        <div style={{ marginLeft: 10 }}>
          <p className="comment-name">{name}</p>
          <p className="comment-message">{message}</p>
          <p className="comment-created-time">{createdTime}</p>
        </div>
      </div>
    </div>
  );
};
