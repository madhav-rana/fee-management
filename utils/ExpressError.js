class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);
        // this.statusCode = 404||statusCode;// ❌ always 404!
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;