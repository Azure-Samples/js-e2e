const express = require("express");
const app = express();
var debug = require("debug")("node_blog:server");

const port = process.env.PORT || "8080";
const redirLocation = "https://abc.com";

app.get("*", (req, res) => {
  res.redirect(redirLocation);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
