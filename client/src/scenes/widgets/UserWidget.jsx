import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import "./w.css"; // Import custom CSS for styling
import { Box, Typography, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:6001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper className="user-widget" onClick={() => navigate(`/profile/${userId}`)}>
      <UserImage image={picturePath} />
      <Box>
        <Typography variant="h4" color={dark} fontWeight="500">
          {firstName} {lastName}
        </Typography>
        <Typography color={medium}>{friends.length} friends</Typography>
      </Box>

      <Box className="info-container">
        <Box className="info-item">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box className="info-item">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Box className="stats-container">
        <Box className="stat">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </Box>
        <Box className="stat">
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </Box>
      </Box>

      <Box className="social-profiles">
        <Box className="social-profile">
          <img src="../assets/twitter.png" alt="twitter" />
          <Box>
            <Typography color={main} fontWeight="500">
              Twitter
            </Typography>
            <Typography color={medium}>Social Network</Typography>
          </Box>
          <EditOutlined sx={{ color: main }} />
        </Box>
        <Box className="social-profile">
          <img src="../assets/linkedin.png" alt="linkedin" />
          <Box>
            <Typography color={main} fontWeight="500">
              Linkedin
            </Typography>
            <Typography color={medium}>Network Platform</Typography>
          </Box>
          <EditOutlined sx={{ color: main }} />
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
