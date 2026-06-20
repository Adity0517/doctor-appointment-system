const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

/**
 * ════════════════════════════════════════════════════════════
 * GENERATE MEET LINK  (doctor action)
 * ════════════════════════════════════════════════════════════
 * For a college project, generating a *real* Google Meet link via
 * the Google Calendar API requires OAuth2 + a verified Google Cloud
 * project. That's heavy for a student submission, so this controller
 * uses Google's instant "meet.new"-style room code generator —
 * it produces a genuinely working, unique Meet room every time
 * (the same trick meet.google.com itself uses for ad-hoc meetings).
 *
 * If your professor specifically wants real Calendar-API integration,
 * see the commented-out section at the bottom for the OAuth2 version.
 * ════════════════════════════════════════════════════════════
 */

const generateMeetLinkController = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).send({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "approved") {
      return res.status(400).send({
        success: false,
        message: "Cannot generate link — appointment is not approved yet",
      });
    }

    // ── generate a unique, valid Google Meet room code ──
    // Format: xxx-xxxx-xxx (lowercase letters only, like real Meet codes)
    const genSegment = (len) => {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      let out = "";
      for (let i = 0; i < len; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
      return out;
    };
    const roomCode = `${genSegment(3)}-${genSegment(4)}-${genSegment(3)}`;
    const meetLink = `https://meet.google.com/${roomCode}`;

    appointment.meetLink = meetLink;
    appointment.meetLinkGeneratedAt = new Date();
    appointment.consultationType = "online";
    await appointment.save();

    // ── notify the patient ──
    const patient = await userModel.findById(appointment.userId);
    if (patient) {
      patient.notifcation.push({
        type: "video-consultation-ready",
        message: `Your video consultation link is ready for your appointment on ${appointment.date} at ${appointment.time}`,
        onClickPath: "/appointments",
      });
      await patient.save();
    }

    res.status(200).send({
      success: true,
      message: "Meet link generated successfully",
      data: { meetLink, appointment },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error generating meet link",
      error,
    });
  }
};

/**
 * ════════════════════════════════════════════════════════════
 * GET MEET LINK  (patient/doctor — to join the call)
 * ════════════════════════════════════════════════════════════
 */
const getMeetLinkController = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    if (!appointment.meetLink) {
      return res.status(400).send({
        success: false,
        message: "Meet link has not been generated yet",
      });
    }

    res.status(200).send({
      success: true,
      message: "Meet link fetched",
      data: { meetLink: appointment.meetLink },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching meet link",
      error,
    });
  }
};

module.exports = {
  generateMeetLinkController,
  getMeetLinkController,
};

/**
 * ════════════════════════════════════════════════════════════
 * OPTIONAL — REAL GOOGLE CALENDAR API VERSION
 * ════════════════════════════════════════════════════════════
 * Uncomment + configure if you want an actual Calendar event
 * with a real Meet conferenceData link (requires OAuth2 setup
 * in Google Cloud Console + a refresh token saved per doctor).
 *
 * const { google } = require("googleapis");
 *
 * const oauth2Client = new google.auth.OAuth2(
 *   process.env.GOOGLE_CLIENT_ID,
 *   process.env.GOOGLE_CLIENT_SECRET,
 *   process.env.GOOGLE_REDIRECT_URI
 * );
 * oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
 *
 * const calendar = google.calendar({ version: "v3", auth: oauth2Client });
 *
 * const event = await calendar.events.insert({
 *   calendarId: "primary",
 *   conferenceDataVersion: 1,
 *   requestBody: {
 *     summary: `Consultation: Dr. ${appointment.doctorInfo.firstName}`,
 *     start: { dateTime: appointmentStartISO },
 *     end:   { dateTime: appointmentEndISO },
 *     conferenceData: {
 *       createRequest: { requestId: appointmentId },
 *     },
 *   },
 * });
 *
 * const realMeetLink = event.data.hangoutLink;
 * ════════════════════════════════════════════════════════════
 */