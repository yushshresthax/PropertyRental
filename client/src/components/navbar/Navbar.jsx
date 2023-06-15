import React, { useEffect, useState } from "react";
import classes from "./navbar.module.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose, AiOutlineFileImage } from "react-icons/ai";
import { ImHome } from "react-icons/im";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../redux/authSlice";
import { request } from "../../util/fetchAPI";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  Alert,
  AlertColor,
  Badge,
  IconButton,
  Popper,
  Fade,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Stack,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import CheckIcon from "@mui/icons-material/Check";

import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { toast, TypeOptions } from "react-toastify";

const types = ["success", "info", "warning", "error"];

const Navbar = () => {
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, clear, markAllAsRead, markAsRead, unreadCount } =
    useNotificationCenter();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  const [notification, setNotification] = useState(null);

  const getNotifications = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/notification`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed Remove");
      }

      const data = await response.json();
      setNotification(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/notification`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed Remove");
      }

      const data = await response.json();
      getNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleNotificationCenter = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const toggleFilter = (e) => {
    setShowUnreadOnly(!showUnreadOnly);
  };
  // mobile
  const [showMobileNav, setShowMobileNav] = useState(false);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setPhoto(null);
    setState({});
  };

  const handleListProperty = async (e) => {
    e.preventDefault();
    let filename = null;
    if (photo) {
      const formData = new FormData();
      filename = crypto.randomUUID() + photo.name;
      formData.append("filename", filename);
      formData.append("image", photo);

      const options = {
        Authorization: `Bearer ${token}`,
      };

      await request("/upload/image", "POST", options, formData, true);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2500);
      return;
    }

    try {
      if (Array.isArray(state) && state.some((v) => !v) && state.length < 8) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2500);
        return;
      }

      const options = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await request("/property", "POST", options, { ...state, img: filename });

      setShowForm(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Function to handle clicks outside the component
    const handleOutsideClick = (event) => {
      // Check if the clicked element is the component itself or its descendants
      if (!event.target.closest(".component-container")) {
        setIsOpen(false); // Close the popper
      }
    };

    // Attach the event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className={`${classes.container} ${isScrolled && classes.scrolled}`}>
      <div className={classes.wrapper}>
        <Link to="/" onClick={scrollToTop} className={classes.left}>
          <ImHome />
          HomeRental
        </Link>
        <ul className={classes.center}>
          <li
            onClick={() => {
              scrollToTop();
              navigate("/");
            }}
            className={classes.listItem}
          >
            Home
          </li>
          <li
            className={classes.listItem}
            onClick={() => {
              scrollToTop();
              navigate("/recommendations");
            }}
          >
            Recommendations
          </li>
        </ul>
        <div className={classes.right}>
          {!user ? (
            <>
              <Link to="/signup">Sign up</Link>
              <Link to="/signin">Sign in</Link>
            </>
          ) : (
            <>
              <IconButton
                size="large"
                onClick={toggleNotificationCenter}
                className="component-container"
              >
                <Badge
                  badgeContent={notification ? notification.length : 0}
                  color="primary"
                >
                  <MailIcon color="action" />
                </Badge>
              </IconButton>
              {!user.isAdmin && (
                <Box component={Link} to="/cart" sx={{ m: 1 }}>
                  <ShoppingCartIcon />
                </Box>
              )}
              <span
                className={classes.username}
                onClick={() => setShowModal((prev) => !prev)}
              >
                Hello {user.username.toUpperCase()}! <FaUserCircle />
              </span>

              {showModal && (
                <div className={classes.userModal}>
                  <AiOutlineClose
                    onClick={() => setShowModal((prev) => !prev)}
                    className={classes.userModalClose}
                  />

                  <span
                    className={classes.list}
                    onClick={() => {
                      navigate("/profile");
                      setShowModal((prev) => !prev);
                    }}
                  >
                    <AccountBoxIcon /> Profile
                  </span>

                  {user.isAdmin && (
                    <>
                      <Link
                        onClick={() => {
                          setShowModal((prev) => !prev);
                          setShowForm(true);
                        }}
                        className={classes.list}
                      >
                        <AddIcon /> Add New Property to List
                      </Link>

                      <span
                        className={classes.list}
                        onClick={() => {
                          navigate("/myproperties");
                          setShowModal((prev) => !prev);
                        }}
                      >
                        Manage My Property List
                      </span>
                      <span
                        className={classes.list}
                        onClick={() => {
                          navigate("/myproperty-bookings");
                          setShowModal((prev) => !prev);
                        }}
                      >
                        My Propery Bookings
                      </span>
                    </>
                  )}

                  <span className={classes.logoutBtn} onClick={handleLogout}>
                    <LogoutIcon /> Logout
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!showMobileNav && showForm && (
        <div className={classes.listPropertyForm} onClick={handleCloseForm}>
          <div
            className={classes.listPropertyWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Property to List</h2>
            <form onSubmit={handleListProperty}>
              <input
                type="text"
                placeholder="Title"
                name="title"
                onChange={handleState}
              />
              <select name="type" onChange={handleState}>
                <option selected disabled>
                  Select type
                </option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="village">Village</option>
              </select>
              <input
                type="text"
                placeholder="Desc"
                name="desc"
                onChange={handleState}
              />

              <select name="continent" onChange={handleState}>
                <option selected disabled>
                  Select Continent
                </option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="South America">South America</option>
                <option value="North America">North America</option>
                <option value="Oceania">Oceania</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                name="price"
                onChange={handleState}
              />
              <input
                type="number"
                placeholder="Sq. meters"
                name="sqmeters"
                onChange={handleState}
              />
              <input
                type="number"
                placeholder="Beds"
                name="beds"
                step={1}
                min={1}
                onChange={handleState}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "50%",
                }}
              >
                <label htmlFor="photo">
                  Property picture <AiOutlineFileImage />
                </label>
                <input
                  type="file"
                  id="photo"
                  style={{ display: "none" }}
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                {photo && <p>{photo.name.slice(0, 5)}..</p>}
              </div>
              <button>List property</button>
            </form>
            <AiOutlineClose
              onClick={handleCloseForm}
              className={classes.removeIcon}
            />
          </div>
        </div>
      )}
      {
        <div className={classes.mobileNav}>
          {showMobileNav && (
            <div className={classes.navigation}>
              <Link to="/" onClick={scrollToTop} className={classes.left}>
                <ImHome />
                HomeRental
              </Link>
              <AiOutlineClose
                className={classes.mobileCloseIcon}
                onClick={() => setShowMobileNav(false)}
              />
              <ul className={classes.center}>
                <li onClick={scrollToTop} className={classes.listItem}>
                  Home
                </li>
                <li className={classes.listItem}>Property</li>
                <li className={classes.listItem}>Recommendations</li>
              </ul>
              <div className={classes.right}>
                {!user ? (
                  <>
                    <Link to="/signup">Sign up</Link>
                    <Link to="/signin">Sign in</Link>
                  </>
                ) : (
                  <>
                    <span>
                      Hello {user.username.toUpperCase()}! <FaUserCircle />
                    </span>
                    <span className={classes.logoutBtn} onClick={handleLogout}>
                      Logout
                    </span>
                    <Link
                      onClick={() => setShowForm(true)}
                      className={classes.list}
                    >
                      List your property
                    </Link>
                  </>
                )}
              </div>
              {showForm && (
                <div
                  className={classes.listPropertyForm}
                  onClick={handleCloseForm}
                >
                  <div
                    className={classes.listPropertyWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Add Property To List</h2>
                    <form onSubmit={handleListProperty}>
                      <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        onChange={handleState}
                      />
                      <input
                        type="text"
                        placeholder="Type"
                        name="type"
                        onChange={handleState}
                      />
                      <input
                        type="text"
                        placeholder="Desc"
                        name="desc"
                        onChange={handleState}
                      />
                      <input
                        type="text"
                        placeholder="Continent"
                        name="continent"
                        onChange={handleState}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        onChange={handleState}
                      />
                      <input
                        type="number"
                        placeholder="Sq. meters"
                        name="sqmeters"
                        onChange={handleState}
                      />
                      <input
                        type="number"
                        placeholder="Beds"
                        name="beds"
                        step={1}
                        min={1}
                        onChange={handleState}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          width: "50%",
                        }}
                      >
                        <label htmlFor="photo">
                          Property picture <AiOutlineFileImage />
                        </label>
                        <input
                          type="file"
                          id="photo"
                          style={{ display: "none" }}
                          onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        {photo && <p>{photo.name}</p>}
                      </div>
                      <button>List property</button>
                    </form>
                    <AiOutlineClose
                      onClick={handleCloseForm}
                      className={classes.removeIcon}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {!showMobileNav && (
            <GiHamburgerMenu
              onClick={() => setShowMobileNav((prev) => !prev)}
              className={classes.hamburgerIcon}
            />
          )}
        </div>
      }

      {/* error */}
      {error && (
        <div className={classes.error}>
          <span>All fields must be filled!</span>
        </div>
      )}
      <Popper open={isOpen} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box>
              <Box
                sx={{
                  background: "#666",
                  padding: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" color="#fff">
                  Notification center
                </Typography>
              </Box>
              <Stack
                sx={{
                  height: "400px",
                  width: "min(60ch, 100ch)",
                  padding: "12px",
                  background: "#f1f1f1",
                  borderRadius: "8px",
                  overflowY: "auto",
                }}
                spacing={2}
              >
                {notification?.map((item) => {
                  return <Alert severity="info">{item.message}</Alert>;
                })}
              </Stack>
              <Box
                sx={{
                  background: "#666",
                  padding: "8px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    handleRead();
                  }}
                >
                  Mark all as read
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default Navbar;
