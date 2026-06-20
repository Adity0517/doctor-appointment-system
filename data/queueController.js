const appointmentModel = require("../models/appointmentModel");

/**
 * ════════════════════════════════════════════════════════════
 * TOKEN / QUEUE SYSTEM
 * ════════════════════════════════════════════════════════════
 * When a doctor APPROVES an appointment, we assign it the next
 * available token number for that doctor on that specific date.
 * Token numbers reset per doctor per day (Token #1, #2, #3...).
 *
 * This file exports a helper function `assignTokenNumber` that you
 * call from inside your existing `updateStatusController` (in
 * doctorController.js) right after an appointment is approved —
 * see the integration note at the bottom.
 * ════════════════════════════════════════════════════════════
 */

/**
 * Call this AFTER an appointment's status is set to "approved".
 * Assigns the next token number for that doctor + date combo.
 */
const assignTokenNumber = async (appointment) => {
  // Only assign once — don't reassign if it already has one
  if (appointment.tokenNumber) return appointment;

  const existingApprovedCount = await appointmentModel.countDocuments({
    doctorId: appointment.doctorId,
    date: appointment.date,
    status: "approved",
    tokenNumber: { $ne: null },
  });

  appointment.tokenNumber = existingApprovedCount + 1;
  appointment.queueDate = appointment.date;
  await appointment.save();

  return appointment;
};

/**
 * GET QUEUE STATUS for a specific appointment (patient-facing)
 * POST /api/v1/queue/status
 * body: { appointmentId }
 *
 * Returns: this patient's token number, how many people are ahead,
 * and an estimated wait time (assumes ~15 min per patient — adjust
 * as needed).
 */
const getQueueStatusController = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "approved" || !appointment.tokenNumber) {
      return res.status(200).send({
        success: true,
        hasToken: false,
        message: "Token will be assigned once your appointment is approved",
      });
    }

    // how many tokens ahead of this one (lower token number = ahead in queue)
    const peopleAhead = await appointmentModel.countDocuments({
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: "approved",
      tokenNumber: { $lt: appointment.tokenNumber },
    });

    const AVG_MINUTES_PER_PATIENT = 15;
    const estimatedWaitMinutes = peopleAhead * AVG_MINUTES_PER_PATIENT;

    res.status(200).send({
      success: true,
      hasToken: true,
      tokenNumber: appointment.tokenNumber,
      peopleAhead,
      estimatedWaitMinutes,
      date: appointment.date,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching queue status",
      error,
    });
  }
};

/**
 * GET FULL QUEUE for a doctor on a given date (doctor-facing)
 * POST /api/v1/queue/doctor-queue
 * body: { doctorId, date }   // date format must match how you store it, e.g. ISO string
 */
const getDoctorQueueController = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    const queue = await appointmentModel
      .find({
        doctorId,
        date,
        status: "approved",
        tokenNumber: { $ne: null },
      })
      .sort({ tokenNumber: 1 });

    res.status(200).send({
      success: true,
      message: "Queue fetched successfully",
      data: queue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor queue",
      error,
    });
  }
};

module.exports = {
  assignTokenNumber,
  getQueueStatusController,
  getDoctorQueueController,
};
