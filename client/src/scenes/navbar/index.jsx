import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showCelebrationEffect, setShowCelebrationEffect] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Added state for search input
  const [searchResults, setSearchResults] = useState([]); // Added state for search results
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleMessagesClick = () => {
    // Simulate fetching notifications data from an API
    const notificationsData = [
      { 
        id: 1, 
        sender: "John Doe",
        avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?size=626&ext=jpg",
        message: "You have a new friend request from John Doe.",
        timestamp: "2024-02-25 08:30 AM",
      },
      // Notifications data truncated for brevity
    ];

    // Set notifications state to display
    setNotifications(notificationsData);

    // Show the celebration effect
    setShowCelebrationEffect(true);

    // Reset the celebration effect after a delay
    setTimeout(() => {
      setShowCelebrationEffect(false);
    }, 5000); // Adjust the duration of the celebration effect
  };

  const handleCloseNotifications = () => {
    setNotifications([]); // Clear notifications when closing
  };
  const handleSearch = async () => {
    try {
      // Call the searchUsers function with the search input
      const results = await searchUsers(searchInput);
      // Set the search results state with the fetched results
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      // Handle error (e.g., show error message)
    }
  };
  
  const searchUsers = async (searchQuery) => {
    try {
      // Make a POST request to the auth/search endpoint with the search query
      const response = await fetch('http://localhost:6001/auth/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: searchQuery }) // Send the search query in the request body
      });
  
      // Check if the response is not OK
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Return the search results
      return data;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error searching users:', error);
      // You can throw an error here or handle it differently based on your app's requirements
      throw error;
    }
  };
  
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Lets Connect
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <IconButton onClick={handleSearch}>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Display search results */}
      <Box>
        {searchResults.map((result) => (
          <div key={result.id}>
            <Avatar src={result.avatar} alt={result.name} />
            <Typography>{result.name}</Typography>
            {/* Add more user profile details as needed */}
          </div>
        ))}
      </Box>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={handleMessagesClick}>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={handleMessagesClick}>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}

      {/* Display Notifications with Celebration Effect */}
      {notifications.length > 0 && (
        <Box
          className={showCelebrationEffect ? "celebration-effect" : ""}
          position="flex"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="1000"
          padding="16px"
          backgroundColor="white"
          borderRadius="8px"
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)" // Add shadow border
        >
          <IconButton
            onClick={handleCloseNotifications}
            sx={{ position: "absolute", top: "8px", right: "8px", color: dark }}
          >
            <Close />
          </IconButton>
          {notifications.map((notification) => (
            <Box key={notification.id} display="flex" alignItems="center" mb="1rem">
              <Avatar src={notification.avatar} alt={notification.sender} sx={{ mr: '1rem' }} />
              <Typography variant="body1"  sx={{ color: "black" }}>
                <b>{notification.sender}</b>: {notification.message} ({notification.timestamp})
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
