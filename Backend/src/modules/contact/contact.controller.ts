import { Request, Response } from "express";
import { createContactService } from "./contact.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const createContactController = async (
  req: Request,
  res: Response
) => {
  const contact = await createContactService(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Your message has been sent successfully",
        contact
      )
    );
};