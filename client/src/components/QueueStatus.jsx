import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QueueStatus.css";

/**
 * Shows a patient's token number + live queue position for an
 * approved appointment.
 *
 * USAGE — inside Appointments.jsx, add a column:
 *   <QueueStatus appointmentId={record._id} status={record.status} />
 */
const QueueStatus = ({ appointmentId, status }) => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/queue/status",
        { appointmentId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLoading(false);
      if (res.data.success) setQueueData(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "approved") {
      fetchStatus();
    }
    // eslint-disable-next-line
  }, [status]);

  if (status !== "approved") {
    return <span className="qs-disabled">—</span>;
  }

  if (loading || !queueData) {
    return <span className="qs-loading">Loading...</span>;
  }

  if (!queueData.hasToken) {
    return <span className="qs-pending">⏳ Token pending</span>;
  }

  return (
    <div className="qs-card">
      <div className="qs-token">🎫 Token #{queueData.tokenNumber}</div>
      {queueData.peopleAhead > 0 ? (
        <p className="qs-wait">
          {queueData.peopleAhead} ahead • ~{queueData.estimatedWaitMinutes} min wait
        </p>
      ) : (
        <p className="qs-wait qs-wait--next">🟢 You're next!</p>
      )}
    </div>
  );
};

export default QueueStatus;
