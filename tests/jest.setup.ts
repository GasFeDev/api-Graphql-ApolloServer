/* eslint-disable no-undef */
import "@testing-library/jest-dom";

// Hide noisy warning about default in-memory configuration.
jest.mock("oidc-provider/lib/helpers/attention");

// NewRelic's bootstrapping can cause some tests that import internals to sporadically fail
jest.mock("newrelic", () => ({
  noticeError: jest.fn(),
  setTransactionName: jest.fn(),
  addCustomAttribute: jest.fn(),
}));

// Stop trying to make it happen.
(global as any).fetch = require("node-fetch");

// Introduces more consistency for DOM-level global variables
(global as any).degaApi = {};

// If any test fails to await unhandled promise rejections... Shut. Down. Everything.
process.on("unhandledRejection", (reason: Error | unknown) => {
  // eslint-disable-next-line no-console
  console.log(reason);
  throw reason;
});
