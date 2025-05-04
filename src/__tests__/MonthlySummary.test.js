import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MonthlySummary from "../Components/RewardsSummary/monthlySummary";
import useFetch from "../Hooks/useFetchHook";

jest.mock("../Hooks/useFetchHook", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockCustomer = {
  id: "1",
  name: "John Doe",
  transactions: [
    { date: "2025-01-10", amount: 120 },
    { date: "2025-02-15", amount: 70 },
    { date: "2025-03-05", amount: 40 },
    { date: "2024-12-20", amount: 130 },
  ],
};

beforeEach(() => {
  useFetch.mockReturnValue({
    data: mockCustomer,
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

const renderComponent = (initialRoute = "/rewards/1/summary") => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/rewards/:customerId/summary"
          element={<MonthlySummary />}
        />
      </Routes>
    </MemoryRouter>
  );
};

test("renders year dropdown and summary title", async () => {
  renderComponent();

  expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
  expect(screen.getByText(/Monthly Rewards Summary/i)).toBeInTheDocument();
});

test("shows summary for selected year", async () => {
  renderComponent();

  const yearDropdown = screen.getByLabelText(/Year/i);
  fireEvent.change(yearDropdown, { target: { value: "2025" } });

  await waitFor(() => {
    expect(screen.getByText(/Jan-2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Feb-2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar-2025/i)).toBeInTheDocument();
  });
});

test("filters out months when different year is selected", async () => {
  renderComponent();

  const yearDropdown = screen.getByLabelText(/Year/i);
  fireEvent.change(yearDropdown, { target: { value: "2024" } });

  await waitFor(() => {
    expect(screen.getByText(/Dec-2024/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jan-2025/i)).not.toBeInTheDocument();
  });
});

test("shows message when no transactions for selected year", async () => {
  const emptyCustomer = {
    ...mockCustomer,
    transactions: [],
  };

  useFetch.mockReturnValueOnce({
    data: emptyCustomer,
    loading: false,
    error: null,
    refetch: jest.fn(),
  });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
  });
});
