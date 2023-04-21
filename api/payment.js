const express = require("express");
const router = express.Router();
const https = require("https");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Checkout } = require("checkout-sdk-node");
const { write } = require("../utils/tinylogger");

const cko = new Checkout("sk_sbox_ytlhf7wsiqiehbpgps5jon5thez", {
  pk: "pk_sbox_ehogtz7ksynphiim5e5nvvpcwuc",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "sandbox payments" });
});

router.post("/validateSession", async (req, res) => {
  const { appleUrl } = req.body;

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      cert: fs.readFileSync(path.join(__dirname, "../certificates/merch.cer")),
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

    write(response.data, "SESSION VALIDATION");

    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

router.post("/pay", async (req, res) => {
  const { version, data, signature, header } = req.body.token.paymentData;

  try {
    const checkoutToken = await cko.tokens.request({
      type: "applepay",
      token_data: {
        version,
        data,
        signature,
        header: {
          ephemeralPublicKey: header.ephemeralPublicKey,
          publicKeyHash: header.publicKeyHash,
          transactionId: header.transactionId,
        },
      },
    });

    write(checkoutToken, "CKO TOKEN");

    const payment = await cko.payments.request({
      source: {
        token: checkoutToken.token,
      },
      processing_channel_id: "pc_jsefibhslk6e7ckyjpkkbihw4y",
      amount: 1,
      currency: "USD",
    });

    write(payment, "PAYMENT REQUEST");

    res.send(payment);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
