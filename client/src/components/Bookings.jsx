import React, { useState, useEffect } from "react";
import { Container, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import KhaltiCheckout from "khalti-checkout-web";
import myKey from "./khaltiKey";
import axios from "axios";

const Bookings = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);
  const [bookingId, setBookingId] = useState("");

  let config = {
    publicKey: myKey.publicTestKey,
    productIdentity: "1",
    productName: "Home Rent",
    productUrl: "http://localhost:3000",
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verfication
        console.log(payload);
        let data = {
          token: payload.token,
          amount: payload.amount,
        };

        axios
          .get(
            `http://localhost:8800/booking/${data.token}/${data.amount}/${myKey.secretKey}`
          )
          .then((response) => {
            console.log(response);
            if (response.data.state.name === "Completed") {
              alert("Payment Complete");
              const updateBookingIsPaid = async (bookingId) => {
                try {
                  const response = await axios.put(
                    `http://localhost:8800/booking/paid/${bookingId}`
                  );
                  console.log(response.data);
                  window.location.reload(false);
                } catch (error) {
                  console.error(error);
                }
              };
              updateBookingIsPaid(bookingId);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
      // onError handler is optional
      onError(error) {
        // handle errors
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
  };

  let checkout = new KhaltiCheckout(config);

  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:8800/booking/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get cart");
      }

      const data = await response.json();
      console.log(data);
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
        Bookings
      </Typography>
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
                    {item?.property.title} (${item.totalPrice})
                  </Typography>
                  {item?.status === "booked" && item.isPaid === true && (
                    <Typography>Paid</Typography>
                  )}
                  <Typography>Status: {item.status.toUpperCase()}</Typography>
                </Stack>
                <Typography variant="h5" component="div"></Typography>
                <Typography variant="body2">
                  Check In: {item.checkIn.slice(0, 10)}
                </Typography>
                <Typography variant="body2">
                  Check Out: {item.checkOut.slice(0, 10)}
                </Typography>
                {item.status === "booked" && item.isPaid === false && (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      checkout.show({ amount: 20000 });
                      setBookingId(item._id);
                    }}
                  >
                    Pay Via Khalti
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default Bookings;
