import { shopifyApi } from '@shopify/shopify-api';
import { shopify } from "../shopify.server";
import express from 'express';

const router = express.Router();

router.post('/api/add-script-tag', async (req, res) => {
  try {
    const session = await shopify.Utils.loadCurrentSession(req, res);

    const scriptTag = await shopify.Clients.Rest.create({
      session,
      resource: 'script_tags',
      body: {
        script_tag: {
          event: 'onload',
          src: `${process.env.HOST}/popup.js`, // 弹窗脚本的URL
          display_scope: 'all',
        },
      },
    });

    res.status(200).send(scriptTag);
  } catch (error) {
    console.error('Failed to add ScriptTag:', error);
    res.status(500).send('Failed to add ScriptTag');
  }
});

export default router;
