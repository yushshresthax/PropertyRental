import React from "react";
import classes from "./footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={classes.wrapper}>
        <div className={classes.col}>
          <h2>Contacts</h2>
          <span>Phone: 9000000000</span>
        </div>
        <div className={classes.col}>
          <h2>Location</h2>
          <span>Continent: Asia</span>
          <span>Country: Nepal</span>
          <span>Current Location: Kathamandu</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
