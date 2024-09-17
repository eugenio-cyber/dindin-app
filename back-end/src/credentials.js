const data = {
  url: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  secretKey: process.env.SECRET_KEY,
};

module.exports = data;
