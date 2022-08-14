const express = require("express");
const app = express();

const port = 3000;

app.listen(port, () => console.log("App is listening now!"));

app.get("/", function (req, res) {
  res.send(
    "Normal usage of the API is send a string with get request to the solve endpoint, with the stringified puzzle e.g. apipath/solve/....5.4.5.6.5.4..4.6.6.4.5.2.3....5.56...4.4..6..6."
  );
});

app.get("/solve", function (req, res) {
  res.send("Hello World");
});

app.use(express.urlencoded({ extended: true }));
