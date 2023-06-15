import React from "react";
import { useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classes from "./signup.module.css";
import { register } from "../../redux/authSlice";

const Signup = () => {
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState("");
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      let filename = null;
      if (photo) {
        const formData = new FormData();
        filename = crypto.randomUUID() + photo.name;
        formData.append("filename", filename);
        formData.append("image", photo);

        await fetch(`http://localhost:8800/upload/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        });
      } else {
        alert("Please Upload Image");
        return;
      }

      const res = await fetch(`http://localhost:8800/auth/register`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ...state, profileImg: filename }),
      });
      const data = await res.json();
      if (data.msg) {
        alert(data.msg);
      } else {
        alert("User Successfully Registered!");
        dispatch(register(data));
        navigate("/");
      }
    } catch (error) {
      alert("Sorry We Cannot Register you :( Try again");
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={handleState}
          />
          <input
            type="text"
            name="email"
            placeholder="Email..."
            onChange={handleState}
          />
          <input
            type="number"
            name="phone"
            placeholder="Phone..."
            onChange={handleState}
          />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            onChange={handleState}
          />
          <label htmlFor="photo">
            <AiOutlineFileImage /> Select Picture
          </label>
          <input
            style={{ display: "none" }}
            id="photo"
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <button type="submit">Create Account</button>
          <div className={classes.last}>
            Already have an account? <Link to="/signin">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
