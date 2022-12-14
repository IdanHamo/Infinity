const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const db = require("../service/database");


require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

router.post("/", async (req, res) => {
  console.log(req.body);
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
  });

  const { value, error } = schema.validate({ username: req.body.username });

  //   const { error } = validateForgetPassword(req.body.username);
  if (error) res.status(400).send(error.details[0].message);

  const sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
  const query = db.query(sql, async (err, results) => {
    try {
      if (err) {
        return res.status(400).send({ ok: false, message: "internal error" });
      } else {
        if (!results.length) {
          return res
            .status(400)
            .send({ ok: false, message: "User does not exist" });
        }
        console.log(results[0]);
        const user = results[0];

        const token = jwt.sign(
          { id: user.user_id, email: user.email },
          config.get("jwtKey")
        );

        user.reset_token = token;

        const oAuth2Client = new google.auth.OAuth2(
          CLIENT_ID,
          CLIENT_SECRET,
          REDIRECT_URL
        );

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        async function sendMail(userEmail) {
          try {
            const accessToken = await oAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
              service: "gmail",
              auth: {
                type: "OAuth2",
                user: "infinityidanproject@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
              },
            });

            const mailOptions = {
              from: "infinityidanproject@gmail.com",
              to: userEmail,
              subject: "Reset Password",
              text: "success",
              html: `<a href='http://localhost:3000/resetPassword/${token}'>reset link</a>`,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
          } catch (error) {
            res.status(404).send({ ok: false, message: "internal error" });
          }
        }
        sendMail(user.email)
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
      }
    } catch (e) {
      return res.status(400).send({ ok: false, message: e });
    }
  });
});

router.put("/confirmPassword/:token", async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const user = jwt.verify(req.params.token, config.get("jwtKey"));
  console.log(user);

  const sql = `SELECT * FROM users WHERE user_id = ${user.id}`;
  const query = db.query(sql, async (err, result) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        message: "internal error",
      });
    }
    if (result.length == 1) {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      const updateUser = `UPDATE users SET password ='${newPassword}'
       WHERE user_id =${user.id}`;

      const passwordQuery = db.query(updateUser, async (err, result) => {
        if (err) {
          return res.status(500).send({
            ok: false,
            message: "internal error",
          });
        }
        return res.status(200).send({
          ok: true,
          message: "The password changed successfully",
        });
      });
    }
  });
});

module.exports = router;
