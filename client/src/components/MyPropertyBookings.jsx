import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MyPropertyBookings = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/${id}/accept`,
        {
          method: "PATCH",
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
      alert(data.message);
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/${id}/reject`,
        {
          method: "PATCH",
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
      alert(data.message);
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  const getCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/owner/requested`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get cart");
      }

      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(booking);
  useEffect(() => {
    getCart();
  }, []);
  return (
    <Container>
      <Typography variant="h4" sx={{ m: 4 }}>
        Requested Bookings
      </Typography>
      <Button variant="outlined" component={Link} to={"/accepted-bookings"}>
        View Accepted Bookings
      </Button>
      <Stack gap={2}>
        {booking?.bookings.map((item) => {
          return (
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Typography
                    sx={{ fontSize: 18 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.property.title} (${item?.totalPrice})
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(item._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ marginLeft: "5px" }}
                      onClick={() => handleReject(item._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </Stack>
                <Typography variant="h5" component="div"></Typography>
                <Typography variant="body2">
                  Requested By: {item.user.username.toUpperCase()} (Email:{" "}
                  {item.user.email})
                </Typography>
                <Typography variant="body2">
                  Check In: {item.checkIn.slice(0, 10)}
                </Typography>
                <Typography variant="body2">
                  Check Out: {item.checkOut.slice(0, 10)}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default MyPropertyBookings;
