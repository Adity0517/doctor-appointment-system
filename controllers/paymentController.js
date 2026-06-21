const Razorpay = require("razorpay");
const crypto = require("crypto");

/**
 * FIX (same pattern as your email setup): only create the Razorpay
 * instance if keys actually exist in .env. If they're missing/invalid,
 * payment routes return a clean error instead of crashing the server
 * on startup.
 */
const paymentConfigured = !!(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

const razorpay = paymentConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

/**
 * ════════════════════════════════════════════════════════════
 * CREATE ORDER  (step 1 — called before opening the Razorpay popup)
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/payment/create-order
 * body: { amount }   // amount in RUPEES (e.g. 500 for ₹500)
 */
const createOrderController = async (req, res) => {
  try {
    if (!paymentConfigured) {
      return res.status(503).send({
        success: false,
        message: "Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env",
      });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise, not rupees
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).send({
      success: true,
      message: "Order created",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID, // safe to expose — this is the PUBLIC key
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating payment order",
      error: error.message,
    });
  }
};

/**
 * ════════════════════════════════════════════════════════════
 * VERIFY PAYMENT  (step 2 — called after the Razorpay popup succeeds)
 * ════════════════════════════════════════════════════════════
 * POST /api/v1/payment/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * CRITICAL: never trust the frontend's "payment succeeded" claim by
 * itself — always verify the signature server-side using your secret
 * key. This is what actually proves the payment is genuine.
 */
const verifyPaymentController = async (req, res) => {
  try {
    if (!paymentConfigured) {
      return res.status(503).send({
        success: false,
        message: "Payment gateway not configured",
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).send({
        success: false,
        message: "Payment verification failed — signature mismatch",
      });
    }

    res.status(200).send({
      success: true,
      message: "Payment verified successfully",
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

module.exports = {
  createOrderController,
  verifyPaymentController,
};
