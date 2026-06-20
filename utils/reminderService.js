const appointmentModel = require("../models/appointmentModel");
const { transporter, emailConfigured } = require("../config/emailConfig");

/**
 * FIX (multiple crash causes resolved):
 *
 * 1. emailConfig.js previously read process.env.EMAIL / EMAIL_PASSWORD,
 *    which don't exist in .env (it's EMAIL_USER / EMAIL_PASS) — so
 *    transporter.auth was always { user: undefined, pass: undefined },
 *    guaranteeing "Missing credentials for PLAIN" on every send.
 *
 * 2. This whole block ran every 60 seconds via setInterval, so even
 *    if you fixed it once, it would crash again a minute later if
 *    Gmail rejected the credentials for ANY reason.
 *
 * 3. `appointments.forEach(async (appointment) => {...})` with an
 *    `await` inside doesn't actually wait for each iteration — forEach
 *    ignores returned promises, so errors inside it can become
 *    unhandled promise rejections that crash the process even though
 *    they're "inside" a try/catch one level up.
 *
 * Fix: skip entirely if email isn't configured, use a real for-loop
 * so each appointment is properly awaited and isolated in its own
 * try/catch, and never let a single failed send affect the others
 * or crash the interval.
 */
setInterval(async () => {
  if (!emailConfigured) {
    // Don't even attempt anything if Gmail credentials aren't set up.
    return;
  }

  try {
    const appointments = await appointmentModel.find({
      status: "approved",
      reminderSent: false,
    });

    for (const appointment of appointments) {
      try {
        if (!appointment.userInfo || !appointment.userInfo.email) {
          continue; // skip if we don't have an email to send to
        }

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: appointment.userInfo.email,
          subject: "Appointment Reminder",
          text: `Reminder: Your appointment is scheduled on ${appointment.date}`,
        });

        appointment.reminderSent = true;
        await appointment.save();
      } catch (sendError) {
        // FIX: isolated per-appointment — one failed email never stops
        // the loop or crashes the server.
        console.log(
          `Reminder email failed for appointment ${appointment._id}:`,
          sendError.message
        );
      }
    }
  } catch (error) {
    console.log("Reminder service error:", error.message);
  }
}, 60000); // every 1 minute