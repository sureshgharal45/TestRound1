import React, { useState } from "react";
import "./Home.css";
import { useDispatch } from "react-redux";
import { register } from "../actions/userAction";
import ScreenRecorder from "../components/ScreenRecorder";
import { useAlert } from "react-alert";

const Home = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const dispatch = useDispatch();
  const alert = useAlert();
  const { name, email } = user;
  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);

    dispatch(register(myForm));
    setUser({ name: "", email: "" });
  };

  const registerDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <form className="loginForm" onSubmit={registerSubmit}>
            <div className="signUpName">
              <input
                type="text"
                placeholder="Enter your name"
                required
                value={user.name}
                name="name"
                onChange={registerDataChange}
              />
            </div>

            <div className="signUpEmail">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={user.email}
                name="email"
                onChange={registerDataChange}
              />
            </div>
            <input
              type="submit"
              value="Login for recordings"
              className="loginBtn"
            />
          </form>
        </div>
        <div className="innerContainerBox">
          <ScreenRecorder />
        </div>
      </div>
    </>
  );
};

export default Home;
