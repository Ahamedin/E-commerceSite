import { json } from "express";
import prisma from "../utilities/connectpsql.js";

export const createproduct = async (req,res) =>{
    const {name,price,image} = req.body

    if(!name || !price || !image){
        return res.status(400).json({success:false, message:"All fields are required"})
    }
    try {
        const newProduct = await prisma.products.create({
            data: {
                name,
                price: parseFloat(price), // Ensure price is a float
                image,
            },
    });
    res.status(201).json({ success:true, data: newProduct});
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success:false, message: "server error"});
    }
};

export const getproduct = async (req,res) =>{
    const { id } = req.params;

    try {
        const product = await prisma.products.findUnique({
            where: { id: parseInt(id) },
        });
        
        if(!product){
            return res.status(404).json({success: false,message: "Product not found"});
        }

        res.status(200).json({ success:true,data: product});
    } catch (error) {
        console.error("Enter fetching product:",error);
        res.status(500).json({success:false,message:"server error"});
    }
};

export const getproducts = async (req,res) =>{
    try {
        const products = await prisma.products.findMany();
        res.status(200).json({ success:true,data: products});
    } catch (error) {
        console.error("Error fetching products:", error.message, error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
            
};

export const updateProduct = async (req,res) =>{
    const { id } = req.params;
    const { name, price, image} = req.body;
    try {
        const existingProduct = await prisma.products.findUnique({
            where: {id: parseInt(id)},
        });

        if (!existingProduct) {
            return res.status(404).json({ success:false,message: "Product not found"});
        }

        const updatedProduct = await prisma.products.update({
            where: {id: parseInt(id)},
            data: {
                name: name || existingProduct.name,
                price: price ? parseFloat(price) : existingProduct.price,
                image: image || existingProduct.image,
            },
        });

        res.status(200).json({ success: true, data: updatedProduct});
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success:false,message: "server error"});
    }
};

export const deleteProduct = async (req,res) =>{
    const { id } = req.params;

    try {
        const existingProduct = await prisma.products.findUnique({
            where: { id: parseInt(id)},
        });

        if(!existingProduct) {
            return res.status(404).json({success: false,message: "Product not found"});
        }

        await prisma.products.delete({
            where: {id: parseInt(id)},
        });

        res.status(200).json({success: true,message:"Product deleted successfully"});
    } catch (error) {
        console.error("Error deleting product:",error);
        res.status(500).json({success: false,message: "server error"});
    }
};