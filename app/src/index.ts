import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger-output.json';

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});