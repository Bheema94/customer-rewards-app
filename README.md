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

![image](https://github.com/user-attachments/assets/7a023f69-0a15-4f30-98ef-ce8cfb4d5a44)


When a year is selected, the month dropdown updates dynamically to show only the months available for that year. The previous month selection is cleared, prompting the user to select a new month.

![image](https://github.com/user-attachments/assets/7134ab1b-61a7-4410-80a4-b3374e755641)

If the user selects the 'Latest Three Months' option from the months dropdown, the data is filtered to show only the most recent three months for the selected year.

![image](https://github.com/user-attachments/assets/b02dc01b-f694-414a-999d-7ba9119f591f)


3. Clicking on a specific month in the summary table navigates the user to the transaction details page, where all transactions for that month are displayed along with their amounts, reward points, and paginated results.

![image](https://github.com/user-attachments/assets/ebece833-7053-423b-bed6-f7d1baafb142)


Testcase success
![image](https://github.com/user-attachments/assets/92e7d697-6e82-42d2-95cb-2bf5eee5bacb)




