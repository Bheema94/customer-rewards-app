import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TransactionDetails from "../Components/TransactionSummary/transactionDetails";
import * as useFetchHook from "../Hooks/useFetchHook";
import { act } from "react-dom/test-utils";
import dayjs from "dayjs";

// Mock data
const mockCustomer = {
  id: "1",
  name: "John Doe",
  transactions: [
    { date: "2025-01-15", amount: 120 },
    { date: "2025-02-10", amount: 70 },
    { date: "2025-03-05", amount: 40 },
  ],
};

// Mock useFetchHook
jest.mock("../Hooks/useFetchHook", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseFetch = useFetchHook.default;

const renderComponent = (initialRoute = "/rewards/1/transactions") => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/rewards/:customerId/transactions"
          element={<TransactionDetails />}
        />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => {
  mockUseFetch.mockReturnValue({
    data: mockCustomer,
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

test("renders filter dropdowns", async () => {
  renderComponent();

  // Check Year dropdown exists
  const yearDropdown = screen.getByLabelText(/Year/i);
  expect(yearDropdown).toBeInTheDocument();

  // Check Month dropdown exists
  const monthDropdown = screen.getByLabelText(/Month/i);
  expect(monthDropdown).toBeInTheDocument();
});

test("shows message when only year is selected", async () => {
  renderComponent();

  const yearDropdown = screen.getByLabelText(/Year/i);
  fireEvent.change(yearDropdown, { target: { value: "2025" } });

  await waitFor(() =>
    expect(
      screen.getByText((content) =>
        content.includes("Select Month to check reward points")
      )
    ).toBeInTheDocument()
  );
});

test("shows filtered transactions when both year and month selected", async () => {
  renderComponent();

  const yearDropdown = screen.getByLabelText(/Year/i);
  fireEvent.change(yearDropdown, { target: { value: "2025" } });

  const monthDropdown = screen.getByLabelText(/Month/i);
  fireEvent.change(monthDropdown, { target: { value: "Jan" } });

  await waitFor(() =>
    expect(
      screen.getByText(/Transaction Details for Jan-2025/i)
    ).toBeInTheDocument()
  );

  // Check for table contents
  expect(screen.getByText(/120/)).toBeInTheDocument(); // transaction amount
  expect(screen.getByText(/Transaction Date/)).toBeInTheDocument();
});
