import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";

const Register = ({ switchToLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.includes("@gmail.com");
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[!@#$%^&*])/;
    return re.test(password) && password.length >= 6;
  };

  const validateUserName = (userName) => {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(userName);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName || !password || !confirmPassword || !email) {
      setError("All fields are required");
      return;
    }

    if (!validateUserName(userName)) {
      setError("Username cannot contain special characters");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must contain '@'");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long and contain at least one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/addUser",
        {
          userName,
          password,
          email,
        }
      );
      setSuccess("User registered successfully");
      setError("");
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed");
      setSuccess("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") {
      setUserName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="register-container">
      <div className="register-title">
        <p>REGISTER</p>
      </div>

      <div className="form-register">
        <form onSubmit={handleRegister}>
          <div className="form-register-content">
            <div className="input-username-form-register">
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={handleInputChange}
                placeholder="Username"
              />
            </div>
            <div className="input-username-form-register">
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div className="input-username-form-register">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Password"
              />
            </div>
            <div className="input-username-form-register">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
            <div className="button-form-register">
              <div className="button-register">
                <button type="submit"><p>Register</p></button>
              </div>
              <div className="button-to-register">
                <p onClick={switchToLogin}><p>Login now</p></p>
              </div>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
