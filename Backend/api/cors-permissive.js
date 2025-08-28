// Very permissive CORS for testing - REMOVE IN PRODUCTION
const corsOptions = {
  origin: true, // Allow ALL origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsOptions;
