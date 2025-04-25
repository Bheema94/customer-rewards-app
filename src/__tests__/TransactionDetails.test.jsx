// src/__tests__/TransactionDetails.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TransactionDetails from "../Components/Customers/customersList";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import useFetch from "../Hooks/useFetchHook";

jest.mock("../Hooks/useFetchHook");

const mockCustomer = {
  customerId: "1",
  firstName: "Bob",
  lastName: "Builder",
  transactions: [
    { amount: 100, date: "2025-04-01" },
    { amount: 80, date: "2025-04-10" },
    { amount: 45, date: "2025-03-15" }
  ],
};

describe("TransactionDetails Component", () => {
  it("renders filtered transactions based on month and year", async () => {
    useFetch.mockReturnValue({
      data: mockCustomer,
      loading: false,
      error: false,
    });

    render(
      <MemoryRouter initialEntries={["/transactions/1?month=4&year=2025"]}>
        <Routes>
          <Route path="/transactions/:customerId" element={<TransactionDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Transactions for Bob Builder - 4\/2025/)).toBeInTheDocument();
      expect(screen.getAllByText(/Rewards:/).length).toBe(2);
    });
  });

  it("displays error message when API fails", async () => {
    useFetch.mockReturnValue({
      data: null,
      loading: false,
      error: true,
    });

    render(
      <MemoryRouter initialEntries={["/transactions/1?month=4&year=2025"]}>
        <Routes>
          <Route path="/transactions/:customerId" element={<TransactionDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to load transactions/i)).toBeInTheDocument();
  });
});
