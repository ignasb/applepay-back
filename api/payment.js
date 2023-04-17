const express = require("express");
const router = express.Router();
const https = require("https");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

router.post("/validateSession", async (req, res) => {
  const { appleUrl } = req.body;
  console.log(req);

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      cert: await fs.readFileSync(
        path.join(__dirname, "/certificates/pay-cert.pem"),
      ),
      // key: fs.readFileSync(path.join(__dirname, "/cert/cert_sandbox.key")),
    });

    const response = await axios.post(
      appleUrl,
      {
        merchandIdentified: "merchant.online.ibsandbox",
        domainName: "name",
        displayName: "IB SANDBOX TEST",
      },
      httpsAgent,
    );

    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
