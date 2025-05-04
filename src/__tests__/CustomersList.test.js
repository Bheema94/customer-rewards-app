import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CustomersList from "../Components/Customers/customersList";
import { BrowserRouter } from "react-router-dom";
import * as useFetchHook from "../Hooks/useFetchHook";
import userEvent from "@testing-library/user-event";

// ✅ Mock the useFetchHook
jest.mock("../Hooks/useFetchHook");

// ✅ Partially mock react-router-dom to preserve other exports like BrowserRouter
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Sample mock data
const mockCustomers = [
  {
    customerId: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    transactions: [{ amount: 120 }, { amount: 45.75 }],
  },
];

describe("CustomersList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render customers with total reward points", async () => {
    useFetchHook.default.mockReturnValue({
      data: mockCustomers,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <CustomersList />
      </BrowserRouter>
    );

    expect(screen.getByText(/Customer Rewards Summary/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("should show error on fetch failure", async () => {
    useFetchHook.default.mockReturnValue({
      data: null,
      loading: false,
      error: "API Error",
    });

    render(
      <BrowserRouter>
        <CustomersList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load customers/i)).toBeInTheDocument();
    });
  });

  it("should show loading indicator", () => {
    useFetchHook.default.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <CustomersList />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("should navigate to the rewards page on row click", async () => {
    useFetchHook.default.mockReturnValue({
      data: mockCustomers,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <CustomersList />
      </BrowserRouter>
    );

    // 🔍 Adjust this to target a specific element or use test-id if available
    const customerRow = await screen.findByText("John");
    await userEvent.click(customerRow);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/rewards/1");
    });
  });
});
