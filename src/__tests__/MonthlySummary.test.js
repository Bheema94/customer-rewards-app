// src/__tests__/MonthlySummary.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MonthlySummary from "../Components/RewardsSummary/monthlySummary";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import useFetch from "../Hooks/useFetchHook";

jest.mock("../Hooks/useFetchHook");

const mockCustomer = {
  customerId: "1",
  firstName: "Alice",
  lastName: "Wonder",
  transactions: [
    { amount: 120, date: "2025-04-15" },
    { amount: 90, date: "2025-03-10" }
  ],
};

describe("MonthlySummary Component", () => {
  it("renders reward summary when data is loaded", async () => {
    useFetch.mockReturnValue({
      data: mockCustomer,
      loading: false,
      error: false,
    });

    render(
      <MemoryRouter initialEntries={["/summary/1?month=4&year=2025"]}>
        <Routes>
          <Route path="/summary/:customerId" element={<MonthlySummary />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Monthly Reward Summary for Alice Wonder/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Reward Points:/i)).toBeInTheDocument();
  });

  it("shows error message on fetch error", async () => {
    useFetch.mockReturnValue({
      data: null,
      loading: false,
      error: true,
    });

    render(
      <MemoryRouter initialEntries={["/summary/1?month=4&year=2025"]}>
        <Routes>
          <Route path="/summary/:customerId" element={<MonthlySummary />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to load customer data/i)).toBeInTheDocument();
  });
});
