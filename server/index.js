const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { CONFIG_DB } = require("./config-db");
const { URL_PATH } = require("../config/url-path");

const PORT = 4000;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection(CONFIG_DB);

db.connect((err) => {
  if (!err) {
    console.log("DB connection success");
  } else {
    console.log("DB connection failed");
  }
});

// Get Location
const SELECT_ALL_LOCATION = "SELECT * FROM location ORDER BY id DESC";
app.get(URL_PATH.LOCATION, (req, res) => {
  db.query(SELECT_ALL_LOCATION, (err, results) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      data: results,
    });
  });
});

// Add location
const ADD_LOCATION =
  "INSERT INTO location (name, address, lat, lng, description) VALUES ?";
app.post(URL_PATH.ADD_LOCATION, (req, res) => {
  const params = [
    [
      req.body.name,
      req.body.address,
      req.body.lat,
      req.body.lng,
      req.body.des || "",
    ],
  ];
  db.query(ADD_LOCATION, [params], (err, results) => {
    console.log("ADD_LOCATION - results: ", results, err);
    if (err) {
      return res.send(err);
    }
    return res.json({ code: 200 });
  });
});

// update location
const UPDATE_LOCATION =
  "UPDATE location SET name = ?, address = ?, lat = ?, lng = ?, description = ? WHERE id = ?";
app.post(URL_PATH.UPDATE_LOCATION, (req, res) => {
  const params = [
    req.body.name,
    req.body.address,
    req.body.lat,
    req.body.lng,
    req.body.des || " ",
    req.body.id,
  ];

  db.query(UPDATE_LOCATION, params, (err, results) => {
    console.log("UPDATE_LOCATION - results: ", results, err);
    if (err) {
      return res.send(err);
    }
    return res.json({ code: 200 });
  });
});

// Remove Location
const REMOVE_LOCATION = "DELETE FROM location WHERE id = ?";
app.post(URL_PATH.REMOVE_LOCATION, (req, res) => {
  db.query(REMOVE_LOCATION, [req.body.id], (err, results) => {
    if (err) {
      return res.send(err);
    }
    return res.json({ code: 200 });
  });
});

// Register
const REGISTER = "INSERT INTO user (name, email, password) VALUES ?";
app.post(URL_PATH.REGISTER, (req, res) => {
  const params = [[req.body.name, req.body.email, req.body.password]];

  db.query(REGISTER, [params], (err, results) => {
    if (err) {
      return res.send(err);
    }
    console.log("REGISTER - results: ", results);

    if (results) {
      return res.json({ code: 200 });
    }

    return res.json({
      message: "Đăng ký thất bại",
    });
  });
});

// Login
const LOGIN = "SELECT * FROM user WHERE email = ? AND password = ?";
app.post(URL_PATH.LOGIN, (req, res) => {
  db.query(LOGIN, [req.body.email, req.body.password], (err, results) => {
    if (err) {
      return res.send(err);
    }
    console.log("LOGIN - results: ", results);

    if (results?.length > 0) {
      return res.json({ code: 200, data: results[0] });
    }

    return res.json({ message: "Tài khoản hoặc mật khẩu không chính xác!!!" });
  });
});

app.listen(PORT, () => console.log("App listening on port 4000"));
