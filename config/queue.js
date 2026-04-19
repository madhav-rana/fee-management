const Bull = require("bull");

const receiptQueue = new Bull("receipt-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
  },
  defaultJobOptions: {
    removeOnComplete: true,  // delete from Redis when done
    removeOnFail: false,     // keep failed jobs for debugging
  }
});

module.exports = receiptQueue;