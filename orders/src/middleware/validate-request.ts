import { validateRequest } from "@daticketslearning/common";
import { RequestHandler } from "express";
import { body, ValidationChain } from "express-validator";
import mongoose from "mongoose";

// Type alias for Validator Middleware
type ValidatorMiddleware = ValidationChain | RequestHandler;

export const validateCreateOrder: ValidatorMiddleware[] = [
  body("ticketId")
    .not()
    .isEmpty()
    // .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be valid"),
];
