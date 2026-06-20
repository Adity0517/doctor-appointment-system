 import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  /* ── update profile ── */
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
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
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  /* ── get doctor info ── */
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) setDoctor(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="pf-banner">
        <h1 className="pf-banner__title">⚙️ Manage Profile</h1>
        <p className="pf-banner__sub">Keep your professional details up to date</p>
      </div>

      {doctor && (
        <div className="pf-card">
          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              ...doctor,
              timings: [
                moment(doctor.timings[0], "HH:mm"),
                moment(doctor.timings[1], "HH:mm"),
              ],
            }}
          >
            <h4 className="pf-section-title">👤 Personal Details</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "First name is required" }]}>
                  <Input placeholder="Your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Last name is required" }]}>
                  <Input placeholder="Your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Phone No" name="phone" rules={[{ required: true, message: "Phone is required" }]}>
                  <Input placeholder="Your contact no" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email is required" }]}>
                  <Input type="email" placeholder="Your email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Website" name="website">
                  <Input placeholder="Your website" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required" }]}>
                  <Input placeholder="Your clinic address" />
                </Form.Item>
              </Col>
            </Row>

            <h4 className="pf-section-title">🩺 Professional Details</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Specialization" name="specialization" rules={[{ required: true, message: "Specialization is required" }]}>
                  <Input placeholder="Your specialization" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Experience (Years)" name="experience" rules={[{ required: true, message: "Experience is required" }]}>
                  <Input placeholder="Your experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Fees Per Consultation" name="feesPerCunsaltation" rules={[{ required: true, message: "Fees is required" }]}>
                  <Input placeholder="Consultation fee" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Timings" name="timings" rules={[{ required: true, message: "Please select timings" }]}>
                  <TimePicker.RangePicker format="HH:mm" className="pf-input" />
                </Form.Item>
              </Col>
            </Row>

            <div className="pf-btn-row">
              <button className="pf-btn" type="submit">
                💾 Update Profile
              </button>
            </div>
          </Form>
        </div>
      )}
    </Layout>
  );
};

export default Profile;