 import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import moment from "moment";
import { message, Table, Tag } from "antd";
import "./DoctorApointments.css";
import VideoConsultationButton from "../VideoConsultationButton";
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  /* ── fetch appointments ── */
  const getAppointments = async () => {
    try {
      const res = await axios.post(
  "/api/v1/doctor/doctor-appointments",
  {},
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
      if (res.data.success) setAppointments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  /* ── approve / reject ── */
  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };
  const handleUpload = async (e, appointmentId) => {
  try {

    const formData = new FormData();

    formData.append("file", e.target.files[0]);
    formData.append("appointmentId", appointmentId);

    const res = await axios.post(
      "/api/v1/doctor/upload-prescription",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      message.success("Prescription Uploaded");
      getAppointments();
    }

  } catch (error) {
    console.log(error);
    message.error("Upload Failed");
  }
};

  const pendingCount  = appointments.filter((a) => a.status === "pending").length;
  const approvedCount = appointments.filter((a) => a.status === "approved").length;

  const statusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "pending")  return "orange";
    return "red";
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "userInfo",
      render: (text, record) => (
        <span className="da-patient">
          🧑 {record.userInfo?.name || "—"}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span className="da-datetime">
          📅 {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          🕒 {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusColor(status)}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
      {
  title: "Actions",
  render: (text, record) =>
    record.status === "pending" ? (
      <div className="da-actions">
        <button
          className="da-btn da-btn--approve"
          onClick={() => handleStatus(record, "approved")}
        >
          ✔ Approve
        </button>

        <button
          className="da-btn da-btn--reject"
          onClick={() => handleStatus(record, "reject")}
        >
          ✖ Reject
        </button>
      </div>
    ) : (
      <>
        <span className="da-status-label">
          ✔ Approved
        </span>

        <br />
        <br />

        <input
          type="file"
          onChange={(e) => handleUpload(e, record._id)}
        />
      </>
    ),
},
    {
  title: "Video Call",
  dataIndex: "video",
  render: (text, record) => (
    <VideoConsultationButton
      appointment={record}
      role="doctor"
      onUpdated={getAppointments}   // re-fetch list after generating link
    />
  ),
},
  ];

  return (
    <Layout>
      {/* ── header ── */}
      <div className="da-header">
        <h1 className="da-header__title">📋 Appointments List</h1>
        <p className="da-header__sub">Review and manage patient appointment requests</p>
      </div>

      {/* ── stats ── */}
      <div className="da-stats">
        <div className="da-stat-card">
          <div className="da-stat-card__icon">📋</div>
          <div>
            <h2>{appointments.length}</h2>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="da-stat-card">
          <div className="da-stat-card__icon da-stat-card__icon--orange">⏳</div>
          <div>
            <h2>{pendingCount}</h2>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="da-stat-card">
          <div className="da-stat-card__icon da-stat-card__icon--green">✔</div>
          <div>
            <h2>{approvedCount}</h2>
            <p>Approved</p>
          </div>
        </div>
      </div>

      {/* ── table ── */}
      <div className="da-table-card">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      </div>
    </Layout>
  );
};

export default DoctorAppointments;