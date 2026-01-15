const crypto = require("crypto");
const Order = require("../models/Order");
const Listing = require("../models/Listing");
const auditLogger = require("../middleware/auditLogger");

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Webhook secret is required
    if (!secret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not defined in environment variables");
        return res.status(500).json({ status: "config_error" });
    }

    // Verify Signature
    // req.body is a Buffer here because of express.raw() in routes
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("Invalid Webhook Signature");
      return res.status(400).json({ status: "invalid_signature" });
    }

    // Parse Event
    const event = JSON.parse(req.body.toString());
    const { payload } = event;

    // Handle 'payment.captured'
    if (event.event === "payment.captured") {
        const payment = payload.payment.entity;
        
        // Retrieve order_id from notes (preferred) or description fallback
        const appOrderId = payment.notes ? payment.notes.order_id : null;

        if (!appOrderId) {
            console.warn("Webhook received payment without order_id in notes:", payment.id);
            // Return 200 so Razorpay thinks we handled it (prevent retries for unprocessable logic)
            return res.json({ status: "ignored_no_reference" });
        }

        const order = await Order.findById(appOrderId);

        if (order && order.status !== "confirmed") {
            console.log(`Webhook confirming order ${order._id} for payment ${payment.id}`);
            
            // Update Order
            order.status = "confirmed";
            order.paymentStatus = "paid";
            // order.paymentId = payment.id; // Uncomment if you add this field to your schema
            await order.save();

            // Update Listing to Sold
            const listing = await Listing.findById(order.listingId);
            if (listing) {
                listing.status = "sold";
                await listing.save();
            }

            // Log it
            await auditLogger(order.buyerId, "WEBHOOK_PAYMENT_CAPTURED", "Order", order._id, `Payment captured via Webhook: ${payment.id}`);
        }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    // Return 200 to prevent Razorpay from retrying indefinitely if it's a logic error
    res.status(200).json({ status: "error_handled", error: error.message }); 
  }
};
