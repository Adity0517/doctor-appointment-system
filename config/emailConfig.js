const nodemailer = require("nodemailer");

/**
 * FIX: env variable names were EMAIL / EMAIL_PASSWORD here, but the
 * actual .env file uses EMAIL_USER / EMAIL_PASS — so credentials were
 * always undefined, guaranteeing the "Missing credentials for PLAIN"
 * crash on every send attempt. Also guards against a missing/invalid
 * .env entirely so requiring this file can never throw.
 */
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = emailConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

module.exports = { transporter, emailConfigured };