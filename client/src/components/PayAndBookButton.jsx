import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useSelector } from "react-redux";
import loadRazorpayScript from "../utils/loadRazorpayScript";
import "./PayAndBookButton.css";

/**
 * Replaces a plain "Book Now" button with a Razorpay payment flow.
 * On successful payment, calls your EXISTING book-appointment API
 * with the payment details attached.
 *
 * USAGE — inside BookingPage.jsx, replace the "Book Now" button with:
 *
 *   import PayAndBookButton from "../components/PayAndBookButton";
 *   ...
 *   <PayAndBookButton
 *     doctors={doctors}
 *     doctorId={params.doctorId}
 *     date={date}
 *     time={time}
 *   />
 */
const PayAndBookButton = ({ doctors, doctorId, date, time }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handlePayAndBook = async () => {
    if (!date || !time) {
      message.warning("Please select date & time first");
      return;
    }

    const amount = doctors.feesPerCunsaltation;
    if (!amount) {
      message.error("Consultation fee not available for this doctor");
      return;
    }

    try {
      setLoading(true);

      // ── 1. load Razorpay's checkout script ──
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setLoading(false);
        message.error("Failed to load payment gateway. Check your internet connection.");
        return;
      }

      // ── 2. create an order on the backend ──
      const orderRes = await axios.post(
        "/api/v1/payment/create-order",
        { amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (!orderRes.data.success) {
        setLoading(false);
        message.error(orderRes.data.message || "Could not start payment");
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderRes.data.data;

      // ── 3. open Razorpay checkout popup ──
      const options = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: "HealthCare+ Appointment",
        description: `Consultation with Dr. ${doctors.firstName} ${doctors.lastName}`,
        order_id: orderId,
        handler: async (response) => {
          // ── 4. verify payment signature on the backend ──
          try {
            const verifyRes = await axios.post(
              "/api/v1/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (!verifyRes.data.success) {
              message.error("Payment verification failed. Please contact support.");
              setLoading(false);
              return;
            }

            // ── 5. payment verified — now actually book the appointment ──
            const bookRes = await axios.post(
              "/api/v1/user/book-appointment",
              {
                doctorId,
                userId: user._id,
                doctorInfo: doctors,
                userInfo: user,
                date,
                time,
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amountPaid: amount,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setLoading(false);

            if (bookRes.data.success) {
              message.success("Payment successful! Appointment booked.");
            } else {
              message.error(
                "Payment succeeded but booking failed. Please contact support with payment ID: " +
                  response.razorpay_payment_id
              );
            }
          } catch (err) {
            setLoading(false);
            console.log(err);
            message.error("Something went wrong after payment. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            message.info("Payment cancelled");
          },
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#0EA5A0" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to initiate payment");
    }
  };

  return (
    <button className="pb-btn" onClick={handlePayAndBook} disabled={loading}>
      {loading ? "Processing..." : `💳 Pay ₹${doctors?.feesPerCunsaltation || ""} & Book`}
    </button>
  );
};

export default PayAndBookButton;
