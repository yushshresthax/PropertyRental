import React from "react";
import classes from "./propertyDetail.module.css";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { request } from "../../util/fetchAPI";
import { FaBed, FaSquareFull } from "react-icons/fa";
import { useRef } from "react";
import { Button, Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Review from "../Review";
import Rating from "@mui/material/Rating";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PropertyDetail = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { id } = useParams();
  const formRef = useRef();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const date = new Date();
  const [checkinDate, setCheckinDate] = useState(date);
  const [checkoutDate, setCheckoutDate] = useState(date);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [reviewId, setReviewId] = useState();
  const [allReviews, setReviews] = useState();

  const fetchDetails = async () => {
    try {
      const data = await request(`/property/find/${id}`, "GET");
      setPropertyDetail(data);

      // user review check
      const reviewResponse = await fetch(
        `http://localhost:8800/review/user/${data._id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reviewData = await reviewResponse.json();
      setReviewId(reviewData);

      //fetch reviews
      const reviews = await fetch(
        `http://localhost:8800/review/property/${data._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reviewsData = await reviews.json();
      console.log(reviews);
      setReviews(reviewsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCloseForm = () => {
    setShowForm(false);
    setTitle("");
    setDesc("");
  };

  const handleDelete = async () => {
    try {
      await request(`/property/${id}`, "DELETE", {
        Authorization: `Bearer ${token}`,
      });
      alert("Successfully Deleted Property!");
      navigate("/myproperties");
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8800/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // You can pass the necessary data as the request body
        body: JSON.stringify({
          propertyId: itemId,
          checkIn: checkinDate,
          checkOut: checkoutDate,
        }),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const cart = await response.json();
      setCheckinDate("");
      setCheckoutDate("");
      alert(cart.message);
      handleClose();
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the fetch request
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.left}>
            <img src={`http://localhost:8800/images/${propertyDetail?.img}`} />
          </div>
          <div className={classes.right}>
            <h3 className={classes.title}>
              Title: {`${propertyDetail?.title}`}
              <Box sx={{ fontSize: "20px" }}>
                <Rating
                  name="read-only"
                  value={Number(propertyDetail?.rating)}
                  readOnly
                />
                ({propertyDetail?.numReviews})
              </Box>
              {user?._id === propertyDetail?.currentOwner?._id && (
                <div className={classes.controls}>
                  <Link to={`/editProperty/${id}`}>Edit</Link>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </h3>
            <div className={classes.details}>
              <div className={classes.typeAndContinent}>
                <div>
                  Type: <span>{`${propertyDetail?.type}`}</span>
                </div>
                <div>
                  Continent: <span>{`${propertyDetail?.continent}`}</span>
                </div>
              </div>
              <div className={classes.priceAndOwner}>
                <span className={classes.price}>
                  <span>Price: $ </span>
                  {`${propertyDetail?.price}`}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  Owner: {propertyDetail?.currentOwner.name}
                </span>
              </div>
              <div className={classes.moreDetails}>
                <span>
                  {propertyDetail?.beds} <FaBed className={classes.icon} />
                </span>
                <span>
                  {propertyDetail?.sqmeters} square meters{" "}
                  <FaSquareFull className={classes.icon} />
                </span>
              </div>
            </div>
            <p className={classes.desc}>
              Description: <span>{`${propertyDetail?.desc}`}</span>
            </p>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedItemId(propertyDetail._id);
                handleOpen();
              }}
            >
              Rent
            </Button>
          </div>
        </div>
        <div>
          {propertyDetail?._id && (
            <Review
              reviewId={reviewId}
              allReviews={allReviews}
              token={token}
              fetchDetails={fetchDetails}
              propertyId={propertyDetail._id}
            />
          )}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="modal-modal-title">Booking Details</h2>
          <TextField
            label="Check-in Date"
            type="date"
            fullWidth
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            fullWidth
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => addToCart(selectedItemId)}
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PropertyDetail;
