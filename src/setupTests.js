import "@testing-library/jest-dom";

// Silence specific React Router warnings in test output
jest.spyOn(console, "warn").mockImplementation((message) => {
  if (
    message.includes("React Router Future Flag Warning") ||
    message.includes("React Router will begin wrapping state updates")
  ) {
    return;
  }
  console.warn(message);
});
