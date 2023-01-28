export const EnvConfiguration = () => ({
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUSERName: process.env.DB_USERNAME,
  dbPASSWord: process.env.DB_PASSWORD,

  port: process.env.PORT || 3000,

  jwtSecret: process.env.JWT_SECRET,
});
