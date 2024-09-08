import express from 'express';
import router from './app/routes/scripttag'; // 引入 ScriptTag 路由

const app = express();

app.use(express.json());
router(app);

