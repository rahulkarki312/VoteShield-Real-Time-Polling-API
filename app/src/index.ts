import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger-output.json';
import { sessionMiddleware } from './middleware/session';
import pollRoutes from './routes/pollRoutes';



const app = express();
const PORT = 3000;

app.set("trust proxy", true);

// Built-in middleware to parse JSON bodies
app.use(express.json());

app.use(sessionMiddleware);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/poll', pollRoutes);

app.get('/', (req, res) => {
    if (req.session) {
      req.session.views = (req.session.views || 0) + 1;
      res.send(`You have viewed this page ${req.session.views} times.`);
    } else {
        res.send('Session not available.');
    } 
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});