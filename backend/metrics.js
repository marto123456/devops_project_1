const client = require("prom-client");

// Collect container metrics automatically
client.collectDefaultMetrics();

// Custom metric tracking for API endpoints
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in ms",
    labelNames: ["method", "route", "status"],
});

module.exports = { client, httpRequestDuration };