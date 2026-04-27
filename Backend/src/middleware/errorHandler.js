
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};
