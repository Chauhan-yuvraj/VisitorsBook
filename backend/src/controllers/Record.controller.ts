import { Request, Response } from "express"
import { Visitor } from "../models/visitor.model";


export const getRecords = async (req: Request, res: Response) => {
    try {

        const records = await Visitor.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}
