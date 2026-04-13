class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = 404||statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;