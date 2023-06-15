import React from "react";
import { Paper, Stack, Typography, Rating } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ReviewCard = (props) => {
  const { review } = props;
  return (
    <Paper variant="outlined" sx={{ mt: "10px", p: "1rem" }}>
      <Stack direction="row" spacing={2}>
        <AccountCircleIcon /> {"   "}
        {review.userId.username.toUpperCase()}
        <Typography sx={{ fontWeight: "bold" }}>{review.name}</Typography>
        <Rating
          name="read-only"
          value={review.rating}
          readOnly
          xs={{ paddingTop: "10px" }}
        />
      </Stack>
      <Typography mt={1}>{review.comment}</Typography>
      <Typography mt={1} variant="overline">
        {" "}
        Reviewed on {review.createdAt}
      </Typography>
    </Paper>
  );
};

export default ReviewCard;
