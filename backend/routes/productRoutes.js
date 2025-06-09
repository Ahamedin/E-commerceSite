import express from "express"
import { createproduct,getproduct,getproducts,updateProduct,deleteProduct } from "../controllers/productController.js";

const router = express.Router();
console.log("test")
router.get("/", getproducts);
router.get("/:id",getproduct)
router.post("/", createproduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;