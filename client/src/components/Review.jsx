import React from "react";
import {
  Typography,
  Rating,
  Button,
  Grid,
  TextField,
  Paper,
  List,
} from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "White",
  boxShadow: 24,
  borderRadius: "16px",
  p: 4,
};

const Review = (props) => {
  const { token, user } = useSelector((state) => state.auth);
  const [rating, setRating, fetchDetails, propertyId] = useState();
  const [comment, setComment] = useState();
  const { reviewId, allReviews } = props;

  //for modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setRating(reviewId.rating);
    setComment(reviewId.comment);
  };
  const handleClose = () => setOpen(false);

  // to add review
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`http://localhost:8800/review/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        propertyId: props.propertyId,
      }),
    });

    const back = await response.json();
    console.log(back);
    alert(back.message);
    props.fetchDetails();
    setComment("");
  };

  //to update user's review
  const handleUpdate = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8800/review/${reviewId._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      }
    );
    const back = await response.json();
    console.log(back);
    alert(back.message);
    props.fetchDetails();
    handleClose();
  };

  //to delete user's review
  const handleDelete = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8800/review/${reviewId._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const back = await response.json();

    alert(back.message);
    props.fetchDetails();
    setComment("");
    setRating("");
  };

  return (
    <Container>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        mb={4}
      >
        {!reviewId ? (
          <Grid item xs={12}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5">Add Review</Typography>
              <Stack direction="column" spacing={2} mt={1} width="100%">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  required
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Review"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={comment}
                  required
                  onChange={(e) => {
                    setComment(e.target.value);
                    console.log(comment);
                  }}
                  inputProps={{ maxLength: 130 }}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5">Your Review</Typography>

            {reviewId && <ReviewCard review={reviewId} />}
            <Stack direction="row" mt={1} justifyContent="flex-end" spacing={1}>
              <Button variant="contained" color="success" onClick={handleOpen}>
                Update
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h5">Rating and Reviews</Typography>
          <Paper style={{ maxHeight: 260, overflow: "auto" }}>
            <List>
              {allReviews && allReviews.length === 0 && (
                <>
                  <Typography m="1rem">No Reviews Yet</Typography>
                </>
              )}
              {props.allReviews &&
                props.allReviews.map((review) => {
                  return <ReviewCard review={review} />;
                })}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* modal for update review */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form" onSubmit={handleUpdate}>
            <Typography variant="h5">Update Review</Typography>
            <Stack direction="column" spacing={2} mt={1} width="100%">
              <Rating
                name="simple-controlled"
                value={rating}
                required
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <TextField
                id="outlined-basic"
                label="Review"
                variant="outlined"
                multiline
                rows={3}
                value={comment}
                required
                onChange={(e) => {
                  setComment(e.target.value);
                  console.log(comment);
                }}
                inputProps={{ maxLength: 130 }}
              />
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Review;
