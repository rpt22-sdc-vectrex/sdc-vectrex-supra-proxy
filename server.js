const express = require('express');
const path = require('path');
const app = express();
const port = 8880;
const axios = require('axios');
const cors = require('cors');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.use(cors());

const proxyRoutes = [
  {
    paths: [ '/reviews/*', '/review-summary/*', '/review-list/*', '/reviews-pictures/*' ],
    server: 'http://localhost:8888',
  },
  {
    paths: [ '/itemDetails/*', '/info' ],
    server: 'http://localhost:5000',
  },
  {
    paths: [ '/pictures', '/pictures/*', '/reviewPhotos/*' ],
    server: 'http://localhost:3000',
  },
  {
    paths: [ '/shipping-api/*' ],
    server: 'http://localhost:7100',
  },
];

proxyRoutes.forEach(route => {
  const { server, paths } = route;
  const handler = (req, res) => {
    const url = server + req.url;
    axios.get(url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
  };
  paths.forEach(path => {
    app.get(path, handler);
  });
});

// fall through to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

