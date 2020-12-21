const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.static('dist'));

module.exports = app;
