 import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table, Input, Tag } from "antd";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");

  /* ── fetch all doctors ── */
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── approve / reject ── */
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const pendingCount  = doctors.filter((d) => d.status === "pending").length;
  const approvedCount = doctors.filter((d) => d.status === "approved").length;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="dt-name">
          👨‍⚕️ {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "approved" ? "green" : status === "rejected" ? "red" : "orange"}>
          {status ? status.toUpperCase() : "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="dt-actions">
          {record.status === "pending" ? (
            <button
              className="dt-btn dt-btn--approve"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              ✔ Approve
            </button>
          ) : record.status === "approved" ? (
            <button
              className="dt-btn dt-btn--reject"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              ✖ Revoke
            </button>
          ) : (
            <button
              className="dt-btn dt-btn--approve"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              ✔ Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {/* ── header banner ── */}
      <div className="dt-banner">
        <h1 className="dt-banner__title">👨‍⚕️ Doctor Management Dashboard</h1>
        <p className="dt-banner__sub">
          Manage doctor approvals and monitor healthcare professionals
        </p>
      </div>

      {/* ── stats ── */}
      <div className="dt-stats">
        <div className="dt-stat-card">
          <div className="dt-stat-card__icon">🩺</div>
          <div>
            <h2>{doctors.length}</h2>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="dt-stat-card">
          <div className="dt-stat-card__icon dt-stat-card__icon--green">✔</div>
          <div>
            <h2>{approvedCount}</h2>
            <p>Approved</p>
          </div>
        </div>
        <div className="dt-stat-card">
          <div className="dt-stat-card__icon dt-stat-card__icon--orange">⏳</div>
          <div>
            <h2>{pendingCount}</h2>
            <p>Pending Approval</p>
          </div>
        </div>
      </div>

      {/* ── search + table ── */}
      <div className="dt-table-card">
        <div className="dt-table-card__header">
          <h3>All Doctors</h3>
          <Input
            placeholder="🔍 Search by doctor name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="dt-search"
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      </div>
    </Layout>
  );
};

export default Doctors;