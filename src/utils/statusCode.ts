export const getStatusCode = (input?: unknown) => {
  if (!input) {
    return 500;
  }
  let statusCode = 500;
  if (typeof input === "string") {
    statusCode = Number.parseInt(input, 10);
  } else if (typeof input === "number") {
    statusCode = input;
  }
  if (!statusCode || !Number.isSafeInteger(statusCode)) {
    return statusCode;
  } else {
    return 500;
  }
};
