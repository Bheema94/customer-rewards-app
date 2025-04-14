import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MonthlySummary from "../monthlyRewardsPage";
import useFetch from "../../Hooks/useFetchHook";
import { BrowserRouter } from "react-router-dom";

// Mocks
jest.mock("../../Hooks/useFetchHook");
jest.mock("../../Components/Filters/filter", () => () => <div>FilterBar</div>);
jest.mock("../../Shared/Spinner", () => () => <div>Loading...</div>);
jest.mock("../../Shared/Pagination/Pagination", () => () => (
  <div>Pagination</div>
));
jest.mock("../../Components/Table/Table", () => ({ data }) => (
  <div>
    {data?.map((row, i) => (
      <div key={i}>{row.month}</div>
    ))}
  </div>
));

// 🔧 Mock Data
const mockCustomerData = {
  customerId: "CUST001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  transactions: [
    { transactionId: "TX001", amount: 120, date: "2025-03-01" },
    { transactionId: "TX002", amount: 60, date: "2025-02-15" },
    { transactionId: "TX003", amount: 30, date: "2025-01-20" },
  ],
};

describe("MonthlySummary Component", () => {
  // ✅ POSITIVE TESTS
  test("Positive: should render FilterBar and Pagination", async () => {
    useFetch.mockReturnValue({
      data: mockCustomerData,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MonthlySummary />
      </BrowserRouter>
    );

    expect(screen.getByText(/FilterBar/i)).toBeInTheDocument();
    expect(screen.getByText(/Pagination/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Mar-2025/i)).toBeInTheDocument(); // formatted month from transaction date
    });
  });

  test("Positive: should display available months from data", async () => {
    useFetch.mockReturnValue({
      data: mockCustomerData,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MonthlySummary />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Mar-2025")).toBeInTheDocument();
      expect(screen.getByText("Feb-2025")).toBeInTheDocument();
      expect(screen.getByText("Jan-2025")).toBeInTheDocument();
    });
  });

  // ❌ NEGATIVE TESTS
  test("Negative: should show loading spinner when loading is true", () => {
    useFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MonthlySummary />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("Negative: should show error message on API failure", () => {
    useFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch",
      refetch: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MonthlySummary />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Error loading customer data/i)
    ).toBeInTheDocument();
  });

  test("Negative: should show 'no data' if no monthly rewards exist", () => {
    useFetch.mockReturnValue({
      data: { ...mockCustomerData, transactions: [] },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MonthlySummary />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/No monthly reward data available/i)
    ).toBeInTheDocument();
  });
});
