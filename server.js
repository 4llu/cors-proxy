const express = require('express');
const request = require('request');

const app = express();
const proxyTo = "https://bad-api-assignment.reaktor.com"

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('**', (req, res) => {
  let realPath = proxyTo + req.params[0]
  console.log(realPath);
  request(
    { url: realPath },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        return res.json(JSON.parse(body));
      }
      else if (error) {
        return res.status(500).json({ type: 'error', message: error.message });
      }
      else {
        return res.status(response.statusCode).json({ type: 'error', message: response.statusCode });
      }

    }
  )
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));