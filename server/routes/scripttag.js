import "@shopify/shopify-api/adapters/node";
// import { Shopify } from "@shopify/shopify-api";
import express from "express";
import shopify from "../../shopify.js";
// import fetch from "node-fetch";
import axios from "axios";

const router = express.Router();

// Shopify API 脚本标签请求
const createScriptTag = async (shop, accessToken) => {
  const url = `https://${shop}/admin/api/2024-07/script_tags.json`;

  const scriptTagData = {
    script_tag: {
      event: "onload",
      src: "https://b5b3-107-167-18-99.ngrok-free.app/popup.js", // 替换为你的 JS 文件 URL
    },
  };

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-Shopify-Access-Token": accessToken,
    //   },
    //   body: JSON.stringify(scriptTagData),
    // });

    // const data = await response.json();
    // return data;

    const response = await axios.post(url, scriptTagData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating ScriptTag:", error);
  }
};

router.post("/api/add-script-tag", async (req, res) => {
  console.log("req.body", req.body);
  const { shop, accessToken } = req.body;
  try {
    const result = await createScriptTag(shop, accessToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ScriptTag" });
  }

  // try {

  //   const { shop, accessToken } = req.body;
  //   console.log("shopify", shopify);
  //   // console.log("res", res);
  //   // console.log("res", res);
  //   // const session = await shopify.utils?.loadCurrentSession(req, res);
  //   // const id = shopifyApi.auth.getCurrentSessionId(req, res);
  //   // const session = await shopify.session.customAppSession({
  //   //   shop: "lionel-tao.myshopify.com",
  //   // });

  //   // console.log("session", session);
  //   const sessionId = await shopify.session.getCurrentId({
  //     isOnline: true,
  //     rawRequest: req,
  //     rawResponse: res,
  //   });

  //   console.log("sessionId ", sessionId);

  //   // const session = await getSessionFromStorage(sessionId);
  //   // Session is built by the OAuth process

  //   // const scriptTag = new shopify.rest.ScriptTag({ session: sessionId });
  //   // scriptTag.event = "onload";
  //   // scriptTag.src = `${process.env.HOST}/popup.js`;
  //   // await scriptTag.save({
  //   //   update: true,
  //   // });

  //   const scriptTag = await new shopify.clients.Rest({
  //     // session,
  //     resource: "script_tags",
  //     body: {
  //       script_tag: {
  //         event: "onload",
  //         src: `${process.env.HOST}/popup.js`, // 弹窗脚本的URL
  //         display_scope: "all",
  //       },
  //     },
  //   });

  //   console.log("scriptTag", scriptTag);

  //   res.status(200).send(scriptTag);
  // } catch (error) {
  //   console.error("Failed to add ScriptTag:", error);
  //   res.status(500).send("Failed to add ScriptTag");
  // }
});

export default router;
