import { validateRequest } from "@daticketslearning/common";
import { RequestHandler } from "express";
import { body, ValidationChain } from "express-validator";

// Type alias for Validator Middleware
type ValidatorMiddleware = ValidationChain | RequestHandler;

export const validateCreateCharge: ValidatorMiddleware[] = [
  body("orderId").not().isEmpty().withMessage("Order ID must be valid"),
  validateRequest,
];
