
module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": "app",
    "host": process.env.POSTGRES_HOST,
    "dialect": process.env.POSTGRES_DB
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_USER,
    "database": "app",
    "host": "db",
    "dialect": "postgres"
  }
}
