require('dotenv').config();
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app); // Create an HTTP server instance
const cors = require('cors');
const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' ? /https?:\/\/(\w+\.)?erastourleagues\.com/ : 'http://localhost:3000',
  credentials: true,
});

const port = process.env.PORT || 3000;

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

/**
 * This is the public facing service, statics and endpoints that don't need auth
 * Will host on AWS Elastic Beanstalk
 */

mongoose
  .connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@swiftball0.tnporuv.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
  })
  .then(async () => {
    console.log('mongo connected');
  })
  .catch(console.error);

app.use(corsMiddleware)

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https')
      // the statement for performing our redirection
      return res.redirect('https://' + req.headers.host + req.url);
    else
      return next();
  } else
    return next();
});

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  // Only use the static middleware in non-production environment
  app.use(express.static('../build'));
  // In production, images are on S3
  app.use('/static', express.static('../static'));
}

const public = require('./endpoints/public');
app.use('/public', public);

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.all('*', (req, res) => {
  res.redirect('/');
});

app.use((err, req, res, next) => {
  // Handle the error in a graceful way
  console.error(err);

  // Send an appropriate response to the client
  res.status(500).json({ error: 'Internal Server Error' });
});

http.listen(port, () => {
  console.log('Server is running...');
});
