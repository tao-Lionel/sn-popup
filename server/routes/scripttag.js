import "@shopify/shopify-api/adapters/node";
import express from "express";
import shopify from "../../shopify.js";
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
    const response = await axios.post(url, scriptTagData, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    });

    console.log("ScriptTag:===", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating ScriptTag:", error);
  }
};

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;

// 随机字符串生成函数，防止 CSRF 攻击
const generateNonce = () => Math.random().toString(36).substring(2, 15);
router.post("/api/shopify", (req, res) => {
  console.log("2222222222", req.body);

  const { shop } = req.body;
  if (!shop) {
    return res.status(400).send("Missing shop parameter!");
  }

  const state = generateNonce(); // 生成唯一的 state 参数，防止 CSRF 攻击
  const redirectUri = encodeURIComponent(
    "https://b5b3-107-167-18-99.ngrok-free.app/api/auth/callback",
  );
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=read_products,write_script_tags&redirect_uri=${redirectUri}&state=${state}`;

  console.log("installUrl", installUrl);

  // 重定向到 Shopify 授权页面
  res.redirect(installUrl);
});

// 步骤 2: 处理 Shopify 的授权回调
router.get("/api/auth/callback", async (req, res) => {
  console.log("11111", req.query);
  const { shop, code, state } = req.query;

  if (!shop || !code) {
    return res.status(400).send("Required parameters missing");
  }

  try {
    // 步骤 3: 使用 code 交换访问令牌
    const accessToken = await exchangeAccessToken(shop, code);
    console.log(`Access token: ${accessToken}`);

    // 成功后可以做其他操作，如获取商店产品等
    // res.send(`Access token: ${accessToken}`);

    try {
      const result = await createScriptTag(shop, accessToken);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ScriptTag" });
    }
  } catch (error) {
    console.error("Error exchanging access token:", error);
    res.status(500).send("Error during OAuth process");
  }
});

// 交换临时的 code 换取永久的 access token
const exchangeAccessToken = async (shop, code) => {
  const url = `https://${shop}/admin/oauth/access_token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code: code,
    }),
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Failed to retrieve access token");
  }

  return data.access_token;
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
