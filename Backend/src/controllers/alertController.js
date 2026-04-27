import Alert from "../models/Alert.js";
import classifyUrgency from "../services/classifyUrgency.js";
import { sendAlertSchema } from "../validations/alertValidation.js";

export const sendAlert = async (req, res, next) => {
  try {
    const { error, value } = sendAlertSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const { name, phone, location, message } = value;
    const { urgency, classifiedBy } = await classifyUrgency(message);

    const alert = await Alert.create({
      name,
      phone,
      location,
      message,
      urgency,
      classifiedBy,
    });

    req.io.emit("newAlert", {
      alertId: alert._id,
      name: alert.name,
      urgency: alert.urgency,
      message: alert.message,
      status: alert.status,
      createdAt: alert.createdAt,
    });

    return res.status(201).json({
      success: true,
      message: "Emergency alert received successfully",
      data: {
        alertId: alert._id,
        urgency: alert.urgency,
        classifiedBy: alert.classifiedBy,
        status: alert.status,
        createdAt: alert.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { urgency, status } = req.query;

    const filter = {};
    if (urgency) filter.urgency = urgency.toUpperCase();
    if (status) filter.status = status.toLowerCase();

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    if (alert.status === "resolved") {
      return res.status(400).json({
        success: false,
        error: "Alert is already resolved",
      });
    }

    alert.status = "resolved";
    await alert.save();

    req.io.emit("alertResolved", {
      alertId: alert._id,
      name: alert.name,
      urgency: alert.urgency,
      message: alert.message,
      status: alert.status,
      resolvedAt: alert.updatedAt,
    });

    return res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};