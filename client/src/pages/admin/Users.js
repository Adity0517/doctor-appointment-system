 import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table, Input } from "antd";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  /* ── fetch all users ── */
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.name}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const doctorCount  = users.filter((u) => u.isDoctor).length;
  const patientCount = users.filter((u) => !u.isDoctor).length;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span className="us-name">👤 {text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <span className="us-email">📧 {text}</span>,
    },
    {
      title: "Role",
      dataIndex: "isDoctor",
      render: (isDoctor) => (
        <span className={`us-role-pill ${isDoctor ? "us-role-pill--doctor" : "us-role-pill--patient"}`}>
          {isDoctor ? "🩺 Doctor" : "🧑 Patient"}
        </span>
      ),
    },
    {
      title: "Actions",
      render: () => (
        <button className="us-block-btn">🚫 Block User</button>
      ),
    },
  ];

  return (
    <Layout>
      {/* ── banner ── */}
      <div className="us-banner">
        <h1 className="us-banner__title">👥 User Management Portal</h1>
        <p className="us-banner__sub">Monitor and manage all registered users</p>
      </div>

      {/* ── stats ── */}
      <div className="us-stats">
        <div className="us-stat-card">
          <div className="us-stat-card__icon">👥</div>
          <div>
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>
        </div>
        <div className="us-stat-card">
          <div className="us-stat-card__icon us-stat-card__icon--green">🩺</div>
          <div>
            <h2>{doctorCount}</h2>
            <p>Doctors</p>
          </div>
        </div>
        <div className="us-stat-card">
          <div className="us-stat-card__icon us-stat-card__icon--blue">🧑</div>
          <div>
            <h2>{patientCount}</h2>
            <p>Patients</p>
          </div>
        </div>
      </div>

      {/* ── search + table ── */}
      <div className="us-table-card">
        <div className="us-table-card__header">
          <h3>All Users</h3>
          <Input
            placeholder="🔍 Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="us-search"
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      </div>
    </Layout>
  );
};

export default Users;