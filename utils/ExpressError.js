class ExpressError extends Error {
  constructor(message, status = 500, code = 'GENERAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = ExpressError;
