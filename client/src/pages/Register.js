 import React from "react";
import "./RegisterStyle.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── form handler ── */
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-bg-circle rg-bg-circle--1" />
      <div className="rg-bg-circle rg-bg-circle--2" />

      <div className="rg-card">
        <div className="rg-card__header">
          <div className="rg-icon">
            <i className="fa-solid fa-user-doctor"></i>
          </div>
          <h3 className="rg-card__title">Doctor Appointment System</h3>
          <p className="rg-card__sub">Create Your Account 🚀</p>
        </div>

        <Form layout="vertical" onFinish={onfinishHandler} className="rg-form">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" className="rg-input" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input type="email" placeholder="you@example.com" className="rg-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password placeholder="Create a password" className="rg-input" />
          </Form.Item>

          <button className="rg-submit-btn" type="submit">
            Create Account
          </button>

          <p className="rg-footer-note">
            Already have an account?{" "}
            <Link to="/login" className="rg-link">
              Sign In
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;