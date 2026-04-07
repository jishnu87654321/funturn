const logSecurityEvent = (event, details = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };

  console.info(JSON.stringify(payload));
};

module.exports = { logSecurityEvent };
