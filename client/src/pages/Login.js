import React from "react";
import "./RegisterStyle.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── form handler ── */
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/home");
        // FIX: reload moved AFTER token is saved & navigation triggered,
        // so the app re-mounts with the user already authenticated
        window.location.reload();
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
          <p className="rg-card__sub">Welcome Back 👋</p>
        </div>

        <Form layout="vertical" onFinish={onfinishHandler} className="rg-form">
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
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" className="rg-input" />
          </Form.Item>

          <button className="rg-submit-btn" type="submit">
            Login
          </button>

          <p className="rg-footer-note">
            Don't have an account?{" "}
            <Link to="/register" className="rg-link">
              Create a New Account →
            </Link>
          </p>
        </Form>
      </div>

      <div
        className="lg-support-btn"
        onClick={() => message.info("Customer Support Coming Soon!")}
        title="Need help?"
      >
        💬
      </div>
    </div>
  );
};

export default Login;