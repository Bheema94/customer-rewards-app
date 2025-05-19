# customer-rewards-app
Created with CodeSandbox

Prerequisites

Ensure the following tools are installed on your local machine before running the project:

Node.js (v20.12.0 ) – Download

npm (v10.5.0 ) or Yarn – comes with Node.js (npm -v to check version)

How to run the code ? 
From the root folder of the project, run the following commands:
npm install
npm start The code will be served on port 3000. Navigate to http://localhost:3000/ in your browser.

How to use the app

1. The homepage of the app will show a list of customers with the total rewards points.

 Dashboard - Customer Rewards Summary

![image](https://github.com/user-attachments/assets/7cc31e98-2d1c-40e9-941c-1adba023031d)

2. Click on a customer navigate to their monthly rewards summary, including a detailed breakdown of rewards earned over the month.

The component fetches customer data using the customer ID from the URL, automatically selects the most recent available year, and by default displays reward points for the latest three months within that year. It also includes a back button to navigate to the previous page.

By default, the months dropdown selects the latest three months, while also providing all available months for the selected year.
 
 Monthly Summary Rewards Summary
 
![image](https://github.com/user-attachments/assets/a5afb92a-fab0-46bf-9f7d-118c6fb0024d)

Use the year and month filters to select a specific time period and instantly view the rewards earned during that month.

![image](https://github.com/user-attachments/assets/5f403c48-a09f-4c5a-8ab8-a4e0a9b67aef)

When a Year is Selected the month dropdown updates dynamically to show only months that belong to the selected year.the month selection is cleared, and the user is prompted to select a month.

![image](https://github.com/user-attachments/assets/5d2cdfa6-a6e1-4404-b675-3ebe544d9055)



3. Clicking on a specific month in the summary table navigates the user to the transaction details page, where all transactions for that month are displayed along with their amounts, reward points, and paginated results.

![image](https://github.com/user-attachments/assets/3b05a86d-9d9d-4113-bea4-d688f61a9023)

Testcase success
![image](https://github.com/user-attachments/assets/92e7d697-6e82-42d2-95cb-2bf5eee5bacb)




