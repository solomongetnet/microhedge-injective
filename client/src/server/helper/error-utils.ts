// errorUtils.ts

type ErrorOrigin = "custom" | "library" | "unexpected";

/**
 * Advanced error handling utility for Next.js.
 * This helper categorizes errors, logs them, and returns appropriate messages.
 * @param {Error | any} error - The error to evaluate.
 * @param {Object} options - Optional configurations for logging and metadata.
 * @param {boolean} options.log - Whether to log the error (default: true).
 * @param {boolean} options.includeStack - Whether to include the error stack in the response (default: false).
 * @returns {Object} - Structured error response including origin, message, and optional stack trace.
 */

const handleErrorResponse = (
  error: any,
  options: { withLog?: boolean } = {}
) => {
  let { withLog = false } = options;

  let origin: ErrorOrigin = "unexpected";
  let message, log;

  // Handling custom errors
  if (error instanceof Error) {
    if (error.name === "Error") {
      origin = "custom";
      message = error.message;
    } else {
      withLog = true;
      origin = "library";
      message = "An unexpected error occurred. Please try again later.";
    }
  } else {
    origin = "unexpected";
    message = "An unexpected error occurred. Please try again later.";
  }

  // Log the error if needed
  if (withLog) {
    log = {
      origin,
      orginalMessage: error.message,
      stack: error.stack,
    };
    console.log(log);
  }

  return {
    origin,
    message,
    log,
  };
};

export { handleErrorResponse };
