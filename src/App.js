import React, { lazy, Suspense } from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Spinner } from "./Shared/index.js";

const CustomersPage = lazy(() => import("./pages/customersPage"));
const MonthlyRewardsSummaryPage = lazy(() =>
  import("./pages/monthlyRewardsPage.js")
);

const TransactionSummaryPage = lazy(() =>
  import("./pages/monthlyTransactionPage.js")
);

export default function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div>
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route
            path="/rewards/:customerId"
            element={<MonthlyRewardsSummaryPage />}
          />
          <Route
            path="/rewards/:customerId/transactions"
            element={<TransactionSummaryPage />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
