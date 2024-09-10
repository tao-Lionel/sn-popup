import express from "express";
import "@shopify/shopify-api/adapters/node";

import scriptTagRoutes from "./server/routes/scripttag.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(express.json());

const allowedOrigins = [
  "https://ri-m-proceedings-fields.trycloudflare.com",
  "https://ae72-104-194-206-225.ngrok-free.app",
  "https://charges-archived-room-current.trycloudflare.com",
  "https://alive-ryan-howto-infinite.trycloudflare.com",
  "https://i-purchases-representations-look.trycloudflare.com",
  "https://story-orbit-anonymous-stand.trycloudflare.com",
  "https://dispute-refused-feb-constructed.trycloudflare.com",
  "https://hh-ellis-buses-proudly.trycloudflare.com",
  "https://permit-belize-begin-opening.trycloudflare.com",
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

app.use(scriptTagRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
