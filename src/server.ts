const app = require('./app').default;

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Ad link bypass backend running on port ${PORT}`);
});
