const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"users",
 required:true
},
   doctorId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"doctors",
 required:true
},
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // pending | approved | rejected
    },

    /* ════════ NEW: VIDEO CONSULTATION FIELDS ════════ */
    consultationType: {
      type: String,
      enum: ["online", "in-person"],
      default: "in-person",
    },
    meetLink: {
      type: String,
      default: "", // populated when doctor generates the video call link
    },
    meetLinkGeneratedAt: {
      type: Date,
      default: null,
    },
    reminderSent:{
type:Boolean,
default:false
},

prescription:{
type:String,
default:""
},
tokenNumber: {
      type: Number,
      default: null, // assigned automatically when the appointment is approved
    },
    queueDate: {
      type: String,
      default: null, // same as `date` — stored separately so token counting is unambiguous
    },
     /* ════════ NEW: PAYMENT ════════ */
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    paymentId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;
