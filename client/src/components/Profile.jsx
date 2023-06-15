import { Container, Stack, TextField, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import React, { useState } from "react";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);

  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  // to update user profile details
  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:8800/user/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert("Server Error: ", err);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        "http://localhost:8800/user/change-password/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: password,
            newPassword,
          }),
        }
      );

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert("Server Error: ", err);
    }
  };
  return (
    <>
      <Container component="main" maxWidth="md">
        <Typography sx={{ mt: 4, textAlign: "center" }} variant="h5">
          User Profile
        </Typography>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          gap={3}
          sx={{ mt: 4 }}
        >
          <TextField
            fullWidth
            id="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            dev
          />
          <TextField
            fullWidth
            id="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
        <Stack flexDirection="row" sx={{ mt: 4 }}>
          <TextField
            fullWidth
            id="outlined"
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => handleUpdate()}
          >
            Update Profile
          </Button>
        </Stack>
        <Stack flexDirection="row" sx={{ mt: 5 }} alignItems="center">
          <Typography variant="h6">Change Password:</Typography>
        </Stack>
        <Stack flexDirection="row" sx={{ mt: 2 }} alignItems="center" gap={3}>
          <TextField
            fullWidth
            id="outlined"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            id="outlined"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => handleChangePassword()}
          >
            Change Password
          </Button>
        </Stack>
      </Container>
    </>
  );
};
export default Profile;
