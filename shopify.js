import { shopifyApi } from "@shopify/shopify-api";
import dotenv from "dotenv";
dotenv.config();

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(","),
  hostName: process.env.HOST?.replace(/https:\/\//, ""),
  isEmbeddedApp: true,
});

export default shopify;
