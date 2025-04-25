import pino from "pino";
import { v4 as uuidv4 } from "uuid";
import base64 from "base-64";

const PARSEABLE_URL = "https://demo.parseable.io/api/v1/logstream/pinotest";
const PARSEABLE_USER = "parseable";
const PARSEABLE_PASSWORD = "parseable";

// Custom send function for transmitting logs
const send = async function (level, logEvent) {
  const logWithExtras = {
    ...logEvent,
    timestamp: new Date().toISOString(),
    level,
    trace_id: uuidv4(),
    app: "customer-rewards", // your app name (optional)
  };

  try {
    const response = await fetch(PARSEABLE_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + base64.encode(`${PARSEABLE_USER}:${PARSEABLE_PASSWORD}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([logWithExtras]),
    });

    if (!response.ok) {
      console.error("Failed to send log to Parseable:", response.status);
    }
  } catch (err) {
    console.error("Log transmission error:", err);
  }
};

// Create pino logger
const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      send,
    },
  },
});

export default logger;
