import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table, Tag } from "antd";
import "./Appointments.css";
import VideoConsultationButton from "./VideoConsultationButton";
import QueueStatus from "../components/QueueStatus";
import ReviewButton from "../components/ReviewButton";
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  /* ── fetch appointments ── */
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setAppointments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const approvedCount = appointments.filter((a) => a.status === "approved").length;
  const pendingCount  = appointments.filter((a) => a.status === "pending").length;

  /* ── status tag colors ── */
  const statusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "pending")  return "orange";
    return "red";
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (text, record) => (
        <span className="ap-doctor">
          👨‍⚕️ Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => (
        <span className="ap-phone">📞 {record.doctorInfo.phone}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span className="ap-datetime">
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
  title: "Video Call",
  dataIndex: "video",
  render: (text, record) => (
    <VideoConsultationButton appointment={record} role="patient" />
  ),
},
    {
  title: "Review",
  dataIndex: "review",
  render: (text, record) =>
    record.status === "approved" ? (
      <ReviewButton appointment={record} />
    ) : (
      <span className="ap-review-disabled">—</span>
    ),
},
    {
title:"Prescription",

render:(text,record)=>(
record.prescription?

<a
href={`http://localhost:8080/uploads/${record.prescription}`}
target="_blank"
rel="noreferrer"
>

📄 Download

</a>

:

"No Prescription"

)
},
{
  title: "Queue",
  dataIndex: "queue",
  render: (text, record) => (
    <QueueStatus appointmentId={record._id} status={record.status} />
  ),
},
  ];

  return (
    <Layout>
      {/* ── header ── */}
      <div className="ap-header">
        <h1 className="ap-header__title">📅 My Appointments</h1>
        <p className="ap-header__sub">Manage and track all your booked appointments</p>
      </div>

      {/* ── stats ── */}
      <div className="ap-stats">
        <div className="ap-stat-card">
          <div className="ap-stat-card__icon">📋</div>
          <div>
            <h2>{appointments.length}</h2>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-card__icon ap-stat-card__icon--green">✔</div>
          <div>
            <h2>{approvedCount}</h2>
            <p>Approved</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-card__icon ap-stat-card__icon--orange">⏳</div>
          <div>
            <h2>{pendingCount}</h2>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* ── table ── */}
      <div className="ap-table-card">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </Layout>
  );
};

export default Appointments;