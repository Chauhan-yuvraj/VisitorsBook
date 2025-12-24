import { Request, Response } from "express";
import { Delivery } from "../models/delivery.model";
import { UserRole } from "@repo/types";

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const { recipientId, carrier, trackingNumber, labelPhotoUrl } = req.body;

    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let targetRecipientId = recipientId;

    if (user.role === UserRole.EMPLOYEE) {
      targetRecipientId = user._id;
    }

    const newDelivery = new Delivery({
      recipientId: targetRecipientId,
      carrier,
      trackingNumber,
      labelPhotoUrl,
      status: "PENDING",
    });

    await newDelivery.save();

    const populatedDelivery = await newDelivery.populate("recipientId", "name email profileImgUri");

    res.status(201).json(populatedDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery", error });
  }
};

export const getDeliveries = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let filter: any = { isDeleted: { $ne: true } };

    if (user.role === UserRole.EMPLOYEE) {
      filter.recipientId = user._id;
    }

    const deliveries = await Delivery.find(filter)
      .populate("recipientId", "name email profileImgUri")
      .sort({ createdAt: -1 });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updateData: any = { status };
    if (status === "COLLECTED") {
      updateData.collectedAt = new Date();
    }

    const query: any = { _id: id };
    if (user.role === UserRole.EMPLOYEE) {
      query.recipientId = user._id;
    }

    const updatedDelivery = await Delivery.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).populate("recipientId", "name email profileImgUri");

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery", error });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const query: any = { _id: id };
    if (user.role === UserRole.EMPLOYEE) {
      query.recipientId = user._id;
    }

    const deletedDelivery = await Delivery.findOneAndUpdate(
      query,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting delivery", error });
  }
};
