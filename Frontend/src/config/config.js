const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://parcel-tracker-sadats-projects-70fa07bb.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const apiUrl = config[environment].apiUrl;
