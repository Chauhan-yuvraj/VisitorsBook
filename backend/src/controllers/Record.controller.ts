import { Request, Response } from "express"
import { Visitor } from "../models/visitor.model";
import { FeedbackRecord } from "../models/FeedbackRecord.model";
import { uploadFileToCloudinary } from "../utils/cloudinary";


export const getRecords = async (req: Request, res: Response) => {
    try {

        const records = await FeedbackRecord.find().populate('VisitorId');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

export const postRecord = async (req: Request, res: Response) => {
    try {
        let { guest, signature, visitType, pages, feedbackText } = req.body;

        // Parse JSON strings if coming from FormData
        if (typeof guest === 'string') guest = JSON.parse(guest);
        if (typeof signature === 'string') signature = JSON.parse(signature);
        if (typeof pages === 'string') pages = JSON.parse(pages);

        let audioUrl = undefined;
        let imageUrl = undefined;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files?.audio?.[0]) {
            // Upload audio to Cloudinary as 'video' resource type (standard for audio)
            audioUrl = await uploadFileToCloudinary(files.audio[0].buffer, 'video');
        }

        if (files?.image?.[0]) {
            // Upload image to Cloudinary
            imageUrl = await uploadFileToCloudinary(files.image[0].buffer, 'image');
        }

        const visitor = await Visitor.findOne({ email: guest.guestEmail });
        let visitorId;

        if (!visitor) {
            const newVisitor = new Visitor({
                name: guest.guestName,
                email: guest.guestEmail,
                phone: guest.guestPhone,
                company: guest.guestCompany,
                profileImgUri: guest.guestImgUri || '',
                featured: guest.featured || false,
            });
            await newVisitor.save();
            visitorId = newVisitor._id;
        } else {
            visitorId = visitor._id;
        }

        const newRecord = new FeedbackRecord({
            VisitorId: visitorId,
            timeStamp: new Date().toISOString(),
            visitType,
            signature,
            pages,
            feedbackText,
            audio: audioUrl,
            image: imageUrl
        });
        await newRecord.save();
        res.status(201).json({ message: "Record created successfully" });

    } catch (error) {
        console.error("Error in postRecord:", error);
        res.status(500).json({ message: "Server Error", error });
    }
}


export const deleteRecord = async (req: Request, res: Response) => {
    console.log("deleting started",)
    const { id } = req.params;
    try {
        const deletedRecord = await FeedbackRecord.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}