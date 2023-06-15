import React, { useEffect, useState } from "react";
import { Container, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Cart = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [cart, setCart] = useState(null);

  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:8800/cart/`, {
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
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(cart);
  useEffect(() => {
    getCart();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8800/cart/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleCheckOut = async (id) => {
    try {
      const response = await fetch(`http://localhost:8800/booking/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const data = await response.json();
      alert(data.message);
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ m: 4 }}>
        Cart
      </Typography>
      <Button variant="outlined" component={Link} to="/bookings">
        View Bookings
      </Button>
      {cart !== null ? (
        <>
          <Stack gap={2}>
            {cart?.items.map((item) => {
              return (
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Stack flexDirection="row" justifyContent="space-between">
                      <Typography
                        sx={{ fontSize: 18 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.property.title} (${item.price})
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        Remove
                      </Button>
                    </Stack>
                    <Typography variant="h5" component="div"></Typography>
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
          <Stack
            sx={{ m: 4 }}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h5">Total: ${cart?.total}</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCheckOut()}
            >
              Checkout Cart
            </Button>
          </Stack>
        </>
      ) : (
        <Typography>Nothing in Cart</Typography>
      )}
    </Container>
  );
};

export default Cart;
