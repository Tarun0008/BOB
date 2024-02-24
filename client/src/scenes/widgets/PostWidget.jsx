import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  CloseOutlined,
  SendOutlined // Import the SendOutlined icon
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Friend from "components/Friend";
import FlexBetween from "components/FlexBetween";
import { motion } from "framer-motion";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(isLiked);
  const [commentInput, setCommentInput] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [totalComments, setTotalComments] = useState(comments.length);

  const patchLike = async () => {
    const response = await fetch(`http://localhost:6001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsLikedByCurrentUser(!isLikedByCurrentUser);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle the submission of the comment
    console.log("Comment submitted:", commentInput);
    // Add the new comment to the comments list
    setComments([...comments, commentInput]);
    setTotalComments(totalComments + 1);
    // Reset comment input field
    setCommentInput("");
    // Close the comment box after submitting the comment
    setIsCommenting(false);
  };

  const handleCloseCommentBox = () => {
    setIsCommenting(false);
  };

  return (
    <Box m="2rem 0">
      <Box>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color="text.primary" sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      </Box>
      {picturePath && (
        <Box mt="0.75rem">
          <img
            src={`http://localhost:6001/assets/${picturePath}`}
            alt="post"
            style={{
              borderRadius: "0.5rem",
              maxWidth: "100%",
            }}
          />
        </Box>
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              <motion.div
                animate={{ scale: isLikedByCurrentUser ? 1.5 : 1 }} // Scale the heart icon if liked
                transition={{ duration: 0.2 }}
              >
                {isLikedByCurrentUser ? (
                  <FavoriteOutlined color="primary" />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </motion.div>
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommenting(!isCommenting)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{totalComments}</Typography> {/* Display total comments count */}
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* Display comments input box and existing comments */}
      {(isCommenting || comments.length > 0) && (
        <Box mt="0.8rem">
          <FlexBetween>
            <form onSubmit={handleCommentSubmit} style={{ display: "flex", alignItems: "center" }}>
            <input
  type="text"
  placeholder="Type your expression..."
  value={commentInput}
  onChange={(e) => setCommentInput(e.target.value)}
  style={{
    borderRadius: "1rem",
    padding: "0.5rem",
    width: "400%", // Set the width to 400% of the original size
    marginRight: "10px", // Add some margin for spacing
    backgroundColor: "black", // Set the background color
  }}
/>


              <IconButton type="submit" onClick={handleCommentSubmit}>
                <SendOutlined /> {/* Use the send symbol instead of "Submit" button */}
              </IconButton>
            </form>
            {/* Close button */}
            <IconButton onClick={handleCloseCommentBox}>
              <CloseOutlined />
            </IconButton>
          </FlexBetween>
          {/* Display existing comments */}
          {comments.length > 0 && (
            <Box mt="0.5rem" style={{ background: "black", padding: "1rem", borderRadius: "0.5rem" }}>
              <div className="comment-container">
                {comments.map((comment, i) => (
                  <Box key={i}>
                    <Divider />
                    <Typography sx={{ m: "0.5rem 0", pl: "1rem", color: "white" }}>
                      {comment}
                    </Typography>
                  </Box>
                ))}
                <Divider />
              </div>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostWidget;
