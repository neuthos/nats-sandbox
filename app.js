const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {connect, StringCodec} = require("nats");
const {v4: uuidv4} = require("uuid");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const clients = new Map();

let nc;

async function setupNats() {
  try {
    nc = await connect({servers: "nats://demo.nats.io:4222"});
    console.log("Connected to NATS");

    const sub = nc.subscribe("messages");
    (async () => {
      for await (const m of sub) {
        const data = StringCodec().decode(m.data);
        const message = JSON.parse(data);
        clients.forEach((client) => {
          client.res.write(`data: ${JSON.stringify(message)}\n\n`);
        });
      }
    })().catch(console.error);
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
}

setupNats();

app.get("/events", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const clientId = uuidv4();
  const newClient = {
    id: clientId,
    res,
  };
  clients.set(clientId, newClient);

  req.on("close", () => {
    clients.delete(clientId);
  });
});

app.post("/login", (req, res) => {
  const {username} = req.body;
  res.json({success: true, username});
});

app.get("/topics", (req, res) => {
  const topics = [
    {id: 1, name: "General"},
    {id: 2, name: "Random"},
  ];
  res.json(topics);
});

app.post("/messages", async (req, res) => {
  const {topicId, message, sender} = req.body;
  const newMessage = {
    id: uuidv4(),
    topicId,
    message,
    sender,
    timestamp: new Date(),
  };

  if (nc) {
    try {
      await nc.publish(
        "messages",
        StringCodec().encode(JSON.stringify(newMessage))
      );
      console.log("Message published to NATS");
    } catch (err) {
      console.error("Error publishing to NATS:", err);
    }
  }

  res.json({success: true, message: newMessage});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  if (nc) {
    await nc.drain();
  }
  process.exit(0);
});
