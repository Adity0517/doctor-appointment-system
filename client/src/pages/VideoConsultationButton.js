import React, { useState } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import "./VideoconsulationButton.css";

/**
 * Reusable button component.
 *
 * USAGE — Doctor side (in DoctorAppointments.jsx table column):
 *   <VideoConsultationButton appointment={record} role="doctor" onUpdated={getAppointments} />
 *
 * USAGE — Patient side (in Appointments.jsx table column):
 *   <VideoConsultationButton appointment={record} role="patient" />
 */
const VideoConsultationButton = ({ appointment, role, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  /* ── doctor generates the link ── */
  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/video/generate-meet-link",
        { appointmentId: appointment._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLoading(false);
      if (res.data.success) {
        message.success("Meet link generated & sent to patient!");
        if (onUpdated) onUpdated();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to generate meet link");
    }
  };

  /* ── show join modal ── */
  const handleJoin = () => {
    Modal.confirm({
      title: "🎥 Join Video Consultation",
      content: (
        <div className="vc-modal-body">
          <p>You're about to join your video consultation.</p>
          <p className="vc-modal-link">{appointment.meetLink}</p>
        </div>
      ),
      okText: "Join Now",
      cancelText: "Cancel",
      onOk: () => {
        window.open(appointment.meetLink, "_blank", "noopener,noreferrer");
      },
    });
  };

  /* ── STEP 1: appointment not approved yet → nobody can do anything ── */
  if (appointment.status !== "approved") {
    return <span className="vc-disabled-label">Available after approval</span>;
  }

  /* ── STEP 2: link already exists → both doctor & patient can join ── */
  if (appointment.meetLink) {
    return (
      <button className="vc-btn vc-btn--join" onClick={handleJoin}>
        🎥 Join Video Call
      </button>
    );
  }

  /* ── STEP 3: no link yet ── */
  // FIX: previously this whole component returned `null` here when
  // consultationType !== "online", which hid the button for DOCTORS too —
  // so there was never a way to generate the first link. Now:
  //   - doctor always sees "Generate" (approved + no link yet)
  //   - patient sees a waiting label
  if (role === "doctor") {
    return (
      <button className="vc-btn vc-btn--generate" onClick={handleGenerateLink} disabled={loading}>
        {loading ? "Generating..." : "🎥 Generate Meet Link"}
      </button>
    );
  }

  return <span className="vc-pending-label">⏳ Link not ready yet</span>;
};

export default VideoConsultationButton;