import React from "react";
import { Link } from "react-router-dom";
import classes from "./recommendedProperties.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { request } from "../../util/fetchAPI";
import { Typography, Grid, Container, Stack, Box, Rating } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import HotelIcon from "@mui/icons-material/Hotel";
import SquareIcon from "@mui/icons-material/Square";
import SouthAmericaIcon from "@mui/icons-material/SouthAmerica";

const PopularProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await request("/property/find", "GET");

        setProperties(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  const addToCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/cart/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers as needed, such as authorization token
        },
        // You can pass the necessary data as the request body
        body: JSON.stringify({
          propertyId: itemId,
          quantity: 1,
          checkIn: "2023-04-14",
          checkOut: "2023-04-15",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const cart = await response.json();
      console.log("Cart:", cart);
      // Do something with the returned cart data, such as updating UI
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the fetch request
    }
  };
  return (
    <Container>
      <Typography variant="h4" textAlign="center" sx={{ mt: 6, mb: 4 }}>
        Recommended Properties
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {properties.map((item) => {
          return (
            <Grid item xs={3}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={`http://localhost:8800/images/${item.img}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Stack flexDirection="row">
                    <Rating
                      name="read-only"
                      value={Number(item?.rating)}
                      readOnly
                    />
                    ({item?.numReviews})
                  </Stack>
                  <Typography gutterBottom variant="h6" component="div">
                    ${item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {item.type.toUpperCase()}
                  </Typography>
                  <Stack flexDirection="row" alignItems="center" gap={2}>
                    <HotelIcon /> {item.beds}
                  </Stack>
                  <Stack flexDirection="row" alignItems="center" gap={2}>
                    <SquareIcon /> {item.sqmeters} m2
                  </Stack>
                  <Stack flexDirection="row" alignItems="center" gap={2}>
                    <SouthAmericaIcon /> {item.continent}
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/propertyDetail/${item._id}`}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PopularProperties;
