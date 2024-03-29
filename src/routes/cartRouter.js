import { Router } from "express";
import cartManager from '../dao/Managers/CartManager.js';
import { __dirname } from "../utils.js";

const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
    let id = req.params.cid;
    try{
        let cart = await cartManager.getCartById(id);
        res.status(200).send({status: "success", payload: cart});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        let id = await cartManager.createNewCart();
        res.status(200).send({status: "success", payload: {id: id}});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let qMany = req.query.quantity;
    try {
        let quantity = await cartManager.addProductToCart(cid, pid, qMany);
        console.log(quantity)
        res.status(200).send({status: "success", payload: {quantity: quantity}});
    } catch (error) {
        res.status(400).send({status: "error", error: error.toString()});
    }
});

export default cartRouter;