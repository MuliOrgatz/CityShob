import express from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger.config';
import routes from './routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Swagger
setupSwagger(app);

export default app;
