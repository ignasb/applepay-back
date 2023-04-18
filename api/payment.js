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
        path.join(__dirname, "../certificates/pay-cert.pem"),
      ),
      // key: fs.readFileSync(path.join(__dirname, "/cert/cert_sandbox.key")),
    });

    const response = await axios.post(
      appleUrl,
      {
        merchantIdentifier: "merchant.online.ibsandbox",
        domainName: "ibsandbox.online",
        displayName: "IB SANDBOX TEST",
      },
      httpsAgent,
    );

    console.log(response.data);
    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
