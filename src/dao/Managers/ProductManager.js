import fs from 'node:fs';
import { productsModel } from "../models/products.js"
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { __dirname } from '../../utils.js';

class ProductManager {
    #path;
    constructor() {
        console.log("new instance created");
    }
    async addProduct(product) {
        if (product.thumbnails === undefined) product.thumbnails = [];

        let newProduct = await productsModel.create(product);
        return newProduct._id;
    }
    async updateProduct(productId, product) {
        if (product.price !== undefined && product.price <= 0) {
            throw Error(`There were values undefined or impossible. Not updating to product ${Object.values(product)}`);
        }
        try { (await productsModel.findByIdAndUpdate(productId, product)).errors } catch { throw "No product with ID " + productId; }
    }
    async deleteProduct(productId) {
        try { (await productsModel.findByIdAndDelete(productId)).errors } catch { throw "No product with ID " + productId; }
    }
    async getProducts(limit, page, query, sort) {
        let check = undefined;
        if (query) {
            switch (query) {
                case "true":
                case "false":
                    check = { stock: query == "true" ? { $gt: 0 } : 0 }
                    break;
                default:
                    if (!isNaN(query)) {
                        check = { price: { $lte: Number(query) } }
                        break;
                    }
                    check = { category: query };
                    break;
            }
        }
        let products = await productsModel.paginate(check, { limit: limit || 10, page: page || 1, sort: sort ? { price: sort } : undefined });
        return products;
    }
    async getProductById(productId) {
        let product = await productsModel.findById(productId);
        if (product == undefined) {
            throw "No product with ID " + productId;
        }
        return product;
    }
    async getProductByCode(code) {
        let product = await productsModel.findOne({ code: code });
        if (product == undefined) {
            throw "No product of code " + code;
        }
        return product;
    }
    async createTestProducts() {
        return await Promise.all([
        this.addProduct({ title: "Real", description: "dddd", code: "he", price: 11, status: true, stock: 25, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "idc", description: "dddd", code: "sadasd", price: 22, status: true, stock: 0, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "mewhen", description: "dddd", code: "asdasd", price: 123, status: true, stock: 25, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "pluh", description: "dddd", code: "gfg", price: 87, status: true, stock: 25, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "heheheh", description: "dddd", code: "xcxc", price: 15, status: true, stock: 25, category: "z", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "asdasd", description: "dddd", code: "aaa", price: 23, status: true, stock: 0, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "eh? hehe!", description: "dddd", code: "v", price: 66, status: true, stock: 0, category: "z", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "asdasd", description: "dddd", code: "hehe", price: 12, status: true, stock: 23, category: "z", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "Im going to kms", description: "dddd", code: "bleh", price: 9, status: true, stock: 11, category: "w", thumbnails: ["asd.json1", "tt.png"] }),
        this.addProduct({ title: "eeeee", description: "dddd", code: "bruv", price: 34, status: true, stock: 6, category: "w", thumbnails: [] }),
        this.addProduct({ title: "truly", description: "dddd", code: "loss", price: 54, status: true, stock: 1, category: "w", thumbnails: [] })
    ]);
    }
    #equalArrays(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}

const productManager = new ProductManager();

export default productManager;


