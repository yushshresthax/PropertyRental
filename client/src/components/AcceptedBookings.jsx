import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AcceptedBookings = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);
  const getCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/booking/owner/booked`,
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
        Accepted Bookings
      </Typography>
      <Button variant="outlined" component={Link} to={"/myproperty-bookings"}>
        View Requested Bookings
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
                    {item.property.title} (${item.totalPrice})
                  </Typography>
                  {item.isPaid === true ? (
                    <Typography>Paid Through Khalti</Typography>
                  ) : (
                    <Typography>Not Paid Yet</Typography>
                  )}
                </Stack>
                <Typography variant="h5" component="div"></Typography>
                <Typography variant="body2">
                  Booked By: {item.user.username.toUpperCase()} (Email:{" "}
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

export default AcceptedBookings;
