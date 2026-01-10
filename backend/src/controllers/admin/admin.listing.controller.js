const Listing = require("../../models/Listing");
const Category = require("../../models/Category");
const auditLogger = require("../../middleware/auditLogger");
const catchAsync = require("../../utils/catchAsync");

// Get all pending listings
exports.getPendingListings = catchAsync(async (req, res) => {
  const pendingListings = await Listing.find({ status: "submitted" })
    .populate("sellerId", "name email")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json({
    message: "Pending listings retrieved successfully",
    count: pendingListings.length,
    listings: pendingListings
  });
});

// Approve a listing
exports.approveListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.status !== "submitted") {
    return res.status(400).json({
      message: `Cannot approve listing with status: ${listing.status}`
    });
  }

  listing.status = "admin_approved";
  listing.approvedBy = req.user.id;
  await listing.save();

  await auditLogger(
    req.user.id,
    "APPROVE_LISTING",
    "Listing",
    listing._id,
    `Listing "${listing.title}" approved`
  );

  res.json({
    message: "Listing approved successfully",
    listing
  });
});

// Reject a listing
exports.rejectListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.status !== "submitted") {
    return res.status(400).json({
      message: `Cannot reject listing with status: ${listing.status}`
    });
  }

  listing.status = "rejected";
  listing.rejectionReason = rejectionReason;
  await listing.save();

  await auditLogger(
    req.user.id,
    "REJECT_LISTING",
    "Listing",
    listing._id,
    `Listing "${listing.title}" rejected. Reason: ${rejectionReason}`
  );

  res.json({
    message: "Listing rejected successfully",
    listing
  });
});

// Override a previous decision (approve or reject)
exports.overrideDecision = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { action, rejectionReason } = req.body;

  if (!action || !["approve", "reject"].includes(action)) {
    return res.status(400).json({
      message: "Valid action (approve/reject) is required"
    });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (!["approved", "pending"].includes(listing.status)) {
    return res.status(400).json({
      message: `Cannot override listing with status: ${listing.status}`
    });
  }

  const previousStatus = listing.status;

  if (action === "approve") {
    listing.status = "approved";
    listing.approvedBy = req.user.id;
    listing.rejectionReason = undefined;
  } else {
    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required when overriding to reject"
      });
    }
    listing.status = "rejected";
    listing.rejectionReason = rejectionReason;
    listing.approvedBy = undefined;
  }

  await listing.save();

  await auditLogger(
    req.user.id,
    "OVERRIDE_LISTING_DECISION",
    "Listing",
    listing._id,
    `Listing "${listing.title}" overridden from ${previousStatus} to ${listing.status}. ${action === "reject" ? `Reason: ${rejectionReason}` : ""}`
  );

  res.json({
    message: "Listing decision overridden successfully",
    listing
  });
});

exports.getInspections = catchAsync(async (req, res) => {
  const listings = await Listing.find({ status: "admin_approved" })
    .populate("sellerId", "name email")
    .populate("category", "name")
    .sort({ updatedAt: -1 });

  res.json(listings);
});

exports.processInspection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { result, notes } = req.body;

  if (!["passed", "failed"].includes(result)) {
    return res.status(400).json({ message: "Result must be 'passed' or 'failed'" });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.status !== "admin_approved") {
    return res.status(400).json({
      message: `Cannot inspect listing with status: ${listing.status}`
    });
  }

  const newStatus = result === "passed" ? "inspection_passed" : "inspection_failed";
  listing.status = newStatus;
  
  // Optionally store notes in rejectionReason or a new field. 
  // For now, if failed, we treat notes as rejection/failure reason
  if (notes) {
    listing.rejectionReason = notes; 
  }

  await listing.save();

  await auditLogger(
    req.user.id,
    "INSPECTION_RESULT",
    "Listing",
    listing._id,
    `Inspection ${result}. Notes: ${notes}`
  );

  res.json({
    message: `Inspection ${result}`,
    listing
  });
});
