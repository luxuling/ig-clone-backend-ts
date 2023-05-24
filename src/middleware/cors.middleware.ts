import cors from 'cors';

const corsOptions = {
  credentials: true,
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
};

const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
