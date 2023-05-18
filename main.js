const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "https://chat.openai.com" })); // Allow ChatGPT to access this API

app.use(express.json());

// Keep track of todo's. Does not persist if Node.js session is restarted.
const _TODOS = {};

app.post("/todos/:username", (req, res) => {
  console.log(req.body);
  const username = req.params.username;
  const todo = req.body.todo;

  console.log(`Adding todo ${todo} for user ${username}`);

  if (!_TODOS[username]) {
    _TODOS[username] = [];
  }

  _TODOS[username].push(todo);
  res.status(200).send("OK");
});

app.get("/todos/:username", (req, res) => {
  console.log(`Fetching todos for user ${req.params.username}`);
  const username = req.params.username;
  res.status(200).json(_TODOS[username] || []);
});

app.delete("/todos/:username", (req, res) => {
  console.log(`Deleting todos for user ${req.params.username}`);
  const username = req.params.username;
  const todo_idx = req.body.todo_idx;

  if (todo_idx >= 0 && todo_idx < _TODOS[username].length) {
    _TODOS[username].splice(todo_idx, 1);
  }

  res.status(200).send("OK");
});

app.get("/logo.png", (req, res) => {
  res.sendFile("logo.png", { root: __dirname }, function (err) {
    if (err) {
      res.status(500).send("Error while fetching logo.png");
    }
  });
});

app.get("/.well-known/ai-plugin.json", (req, res) => {
  fs.readFile("./.well-known/ai-plugin.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error while fetching ai-plugin.json");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
  });
});

app.get("/openapi.yaml", (req, res) => {
  fs.readFile("./openapi.yaml", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error while fetching openapi.yaml");
      return;
    }
    res.setHeader("Content-Type", "application/yaml");
    res.status(200).send(data);
  });
});

app.listen(5003, () => {
  console.log("Server running on port 5003");
});
