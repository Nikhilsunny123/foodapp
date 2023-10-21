import express from "express";
import { check, validationResult } from "express-validator";

import adminAuthenticator from "../../common/adminAuthenticator";
import FoodApp from "../../models/foodModel";



const foodAppAdminRouter = express.Router();

foodAppAdminRouter.post(
  "/add",
  adminAuthenticator,
  [
    check("name").notEmpty().withMessage("Invalid name"),
    check("price").notEmpty().withMessage("Invalid price"),
    check("description").notEmpty().withMessage("Invalid description"),
    check("image").notEmpty().withMessage("Invalid image"),
  ],
  // authenticateJWT,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, price, description, image } = req.body;

      const item = await FoodApp.findOne({ name });

      if (item) {
        return res.status(500).json({ message: "this item already exist" });
      }
      const newFoodItem = new FoodApp({
        name,
        price,
        description,
        image,
      });
      const newFoodItemResp = await newFoodItem.save();
      console.log(newFoodItemResp);

      return res.status(200).json({
        message: "Food item added successfully",
        data: newFoodItemResp,
      });
    } catch (error) {
      let message = "Server Error";
      if (error.message) {
        message = error.message;
      }
      return res.status(500).json({ message: message });
    }
  }
);


export default foodAppAdminRouter;