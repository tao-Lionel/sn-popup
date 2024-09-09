import express from "express";
import "@shopify/shopify-api/adapters/node";
import { shopifyApi } from "@shopify/shopify-api";
import scriptTagRoutes from "./server/routes/scripttag.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://ri-m-proceedings-fields.trycloudflare.com",
  "https://ae72-104-194-206-225.ngrok-free.app",
  "https://charges-archived-room-current.trycloudflare.com",
  "https://alive-ryan-howto-infinite.trycloudflare.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        // 允许指定的 origin
        callback(null, true);
      } else {
        // 禁止请求
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 允许携带认证信息
  }),
);

console.log("process.env.SHOPIFY_API_KEY", process.env.SHOPIFY_API_KEY);
const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(","),
  hostName: process.env.HOST?.replace(/https:\/\//, ""),
  isEmbeddedApp: true,
});

// shopifyApi.Context.initialize({
//   API_KEY: process.env.SHOPIFY_API_KEY,
//   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
//   SCOPES: process.env.SCOPES.split(","),
//   HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
//   IS_EMBEDDED_APP: true,
//   API_VERSION: "2023-04",
//   SESSION_STORAGE: new shopifyApi.Session.MemorySessionStorage(),
// });

app.use(scriptTagRoutes);

app.listen(process.env.PORT || 3030, () => {
  console.log(`Server running on port ${process.env.PORT || 3030}`);
});
