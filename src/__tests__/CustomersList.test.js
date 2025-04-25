import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CustomersList from "../Components/Customers/customersList";
import { BrowserRouter } from "react-router-dom";
import * as useFetchHook from "../Hooks/useFetchHook";

// ✅ Mock the useFetchHook directly
jest.mock("../Hooks/useFetchHook");

import { useNavigate } from "react-router-dom";

// ✅ Mocking the useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
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
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn(); // Mock the navigate function
    useNavigate.mockReturnValue(mockNavigate); // Mock return value of useNavigate
    jest.clearAllMocks();
  });

  it("should render customers with total reward points", async () => {
    // Mock success response from useFetch
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
    // Mock error response from useFetch
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
      expect(
        screen.getByText(/Failed to load customers/i)
      ).toBeInTheDocument();
    });
  });

  it("should show loading indicator", () => {
    // Mock loading state from useFetch
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
    // Mock success response from useFetch
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

    // Simulate row click (assuming row click triggers navigate)
    const customerRow = screen.getByText("John"); // Adjust according to row content
    customerRow.click();

    // Check if navigate was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/rewards/1");
  });
});
