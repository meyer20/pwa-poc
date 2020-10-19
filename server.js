const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/pwa-example'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname+'/dist/pwa-example/index.html');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server running!');
});
