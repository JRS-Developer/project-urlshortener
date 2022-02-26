require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns").promises;
const URL = require("url").URL;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// URLS saved;
const urls = {};
let index = 1;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  try {
    const originalUrl = req.body?.url;
    if (!originalUrl) {
      res.json({ error: "Please provide a URL" });
    }

    const { hostname } = new URL(originalUrl);

    dns
      .lookup(hostname)
      .then(() => {
        urls[index] = originalUrl;

        res.json({ original_url: originalUrl, short_url: index });
        index++;
      })
      .catch((e) => {
        res.json({
          error: "Please provide a valid URL",
        });
      });
  } catch (e) {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const url = req.params.short_url;

  if (!urls[url]) {
    return res.json({ error: "No such url" });
  }

  res.redirect(urls[url]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
