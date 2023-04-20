const express = require("express");
const router = express.Router();
const https = require("https");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "sandbox payments" });
});

router.post("/validateSession", async (req, res) => {
  const { appleUrl } = req.body;

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      cert: await fs.readFileSync(
        path.join(__dirname, "../certificates/merch.cer"),
      ),
      key: fs.readFileSync(path.join(__dirname, "../certificates/merch.key")),
    });

    const response = await axios.post(
      appleUrl,
      {
        merchantIdentifier: "merchant.online.ibsandbox",
        domainName: "www.ibsandbox.online",
        displayName: "IB SANDBOX TEST",
      },
      {
        httpsAgent,
      },
    );

    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
