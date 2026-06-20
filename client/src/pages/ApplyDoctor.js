 import React from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import "./ApplyDoctor.css";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ── submit application ── */
  const handleFinish = async (values) => {
    try {
      if (!values.timings) {
        message.error("Please select timings");
        return;
      }
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user._id,
          timings: [
            values.timings[0].format("HH:mm"),
            values.timings[1].format("HH:mm"),
          ],
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Apply Doctor Error:", error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <Layout>
      <div className="ad-banner">
        <h1 className="ad-banner__title">🩺 Apply as a Doctor</h1>
        <p className="ad-banner__sub">
          Join our network of trusted healthcare professionals
        </p>
      </div>

      <div className="ad-card">
        <Form layout="vertical" onFinish={handleFinish}>
          <h4 className="ad-section-title">👤 Personal Details</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="Your first name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Your last name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                rules={[{ required: true, message: "Phone is required" }]}
              >
                <Input placeholder="Your contact no" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input type="email" placeholder="Your email address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Your website" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input placeholder="Your clinic address" />
              </Form.Item>
            </Col>
          </Row>

          <h4 className="ad-section-title">🎓 Professional Details</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: true, message: "Specialization is required" }]}
              >
                <Input placeholder="Your specialization" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience (Years)"
                name="experience"
                rules={[{ required: true, message: "Experience is required" }]}
              >
                <Input placeholder="Your experience" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerCunsaltation"
                rules={[{ required: true, message: "Fees is required" }]}
              >
                <Input placeholder="Consultation fee" />
              </Form.Item>
            </Col>

            {/* FIX: was nested inside Form.Item("timings") — split into two proper fields */}
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Consultation Type"
                name="consultationType"
                rules={[{ required: true, message: "Please select consultation type" }]}
              >
                <Input placeholder="e.g. Online / In-person" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Timings"
                name="timings"
                rules={[{ required: true, message: "Please select doctor timings" }]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  minuteStep={15}
                  className="ad-input"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="ad-btn-row">
            <button className="ad-btn" type="submit">
              📨 Submit Application
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;