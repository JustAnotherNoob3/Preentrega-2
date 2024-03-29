import { Router } from "express";
import { __dirname } from "../utils.js";
import productManager from '../dao/Managers/ProductManager.js';
import chatManager from "../dao/Managers/ChatManager.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
    let products = (await productManager.getProducts()).map((x) => {
        let p = x.toObject();
        return {id: p._id.toString(), title: p.title, pair: Object.keys(p).map((obj, i) => {if(obj=="__v")return undefined;return {key: toTitleCase(obj), value:Object.values(p)[i]}})}
    });
    res.render("home", {product: products});
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  let products = (await productManager.getProducts()).map((x) => {
    let p = x.toObject();
    return {id: p._id.toString(), title: p.title, pair: Object.keys(p).map((obj, i) => {if(obj=="__v")return undefined;return {key: toTitleCase(obj), value:Object.values(p)[i]}})}
    });
    res.render("realTimeProducts",{product: products});
});
viewsRouter.get("/chat", async (req, res) => {
  let msgs = (await chatManager.getMessages()).map((x) => x.toObject());
  console.log(msgs);
    res.render("chat",{messages: msgs});
});
function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

export default viewsRouter;