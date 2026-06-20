 import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NotificationPage.css";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  /* ── mark all read ── */
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  /* ── delete all read ── */
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong in notifications");
    }
  };

  const unreadCount = user?.notifcation?.length || 0;
  const readCount = user?.seennotification?.length || 0;

  return (
    <Layout>
      {/* ── header ── */}
      <div className="np-header">
        <div>
          <h2 className="np-header__title">🔔 Notification Center</h2>
          <p className="np-header__sub">Stay updated with appointments and doctor requests</p>
        </div>
      </div>

      <div className="np-card">
        <Tabs
          items={[
            {
              key: "0",
              label: `Unread (${unreadCount})`,
              children: (
                <div className="np-tab-body">
                  <div className="np-tab-actions">
                    <button className="np-btn np-btn--mark" onClick={handleMarkAllRead}>
                      ✔ Mark All Read
                    </button>
                  </div>

                  {unreadCount === 0 ? (
                    <div className="np-empty">
                      <div className="np-empty__icon">🎉</div>
                      <h3>No New Notifications</h3>
                      <p>You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="np-list">
                      {user.notifcation.map((notificationMsg, index) => (
                        <div
                          key={index}
                          className="np-item np-item--unread"
                          onClick={() => navigate(notificationMsg.onClickPath)}
                        >
                          <span className="np-item__dot" />
                          <span className="np-item__icon">🔔</span>
                          <span className="np-item__text">{notificationMsg.message}</span>
                          <span className="np-item__arrow">→</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "1",
              label: `Read (${readCount})`,
              children: (
                <div className="np-tab-body">
                  <div className="np-tab-actions">
                    <button className="np-btn np-btn--delete" onClick={handleDeleteAllRead}>
                      🗑 Delete All Read
                    </button>
                  </div>

                  {readCount === 0 ? (
                    <div className="np-empty">
                      <div className="np-empty__icon">📭</div>
                      <h3>No Read Notifications</h3>
                      <p>Notifications you've seen will appear here</p>
                    </div>
                  ) : (
                    <div className="np-list">
                      {user.seennotification.map((notificationMsg, index) => (
                        <div
                          key={index}
                          className="np-item np-item--read"
                          onClick={() => navigate(notificationMsg.onClickPath)}
                        >
                          <span className="np-item__icon">✅</span>
                          <span className="np-item__text">{notificationMsg.message}</span>
                          <span className="np-item__arrow">→</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </Layout>
  );
};

export default NotificationPage;