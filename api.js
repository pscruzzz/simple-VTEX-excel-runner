const axios = require('axios')

const dotenv = require('dotenv');
dotenv.config();

const api = axios.create({
  baseURL: process.env.ACCOUNT_URL,
  headers:{
    'Content-Type': 'application/json',
    'accept': 'application/json',
    "X-VTEX-API-AppKey": process.env.APP_KEY,
    "X-VTEX-API-AppToken": process.env.APP_TOKEN
  }
})


module.exports = api