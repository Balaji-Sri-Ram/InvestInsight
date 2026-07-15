# InvestInsight

InvestInsight is an AI-powered financial research tool I built for this assignment. It's designed to give deep insights into companies for investors by pulling data from multiple sources and summarizing it using an LLM. I used Google Gemini as the core AI for this project.

---

## Overview
Here is what the application does:
1. It takes a company name that you type in.
2. It grabs hard numbers (revenue, net income, PE ratio, stock price, market cap, etc.) using a package called `yahoo-finance2`.
3. If the company is private or if qualitative context is needed (like competitors, risks, and recent news), it falls back to `Tavily` search to find that information.
4. It feeds all of this data into `Google Gemini` to analyze the company's financial health, growth opportunities, and risks.
5. Finally, it generates a structured investment report and shows it on the React frontend.

---

## How to run it

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (Make sure it's running on your machine)
- API Keys for Google Gemini and Tavily

### Setup Steps
1. **Unzip the folder** and open the `InvestInsight` directory in your terminal.
2. **Install all the dependencies:**
   - In the `client` folder, run: `npm install`
   - In the `server` folder, run: `npm install`
3. **Set up the Environment Variables:**
   - Go to the `server` folder.
   - You will see a `.env.example` file. Create a new file called `.env` in the same folder and copy the contents over.
   - Fill in your actual database URL and API keys in the `.env` file:
     ```env
     PORT=5000
     NODE_ENV=development
     DATABASE_URL="postgresql://user:password@localhost:5432/investinsight?schema=public"
     GEMINI_API_KEY="your_google_gemini_api_key_here"
     TAVILY_API_KEY="your_tavily_api_key_here"
     CLIENT_URL="http://localhost:5173"
     ```
4. **Set up the Database:**
   - In the `server` folder, run `npx prisma db push` (or `npx prisma migrate dev`) so Prisma can set up the tables in your Postgres database.
5. **Run the app:**
   - Start the backend (in the `server` folder): `npm run dev`
   - Start the frontend (in the `client` folder): `npm run dev`
6. Open your browser and go to `http://localhost:5173` to see it running.

---

## How it works (Architecture)

- **Frontend:** I built the frontend using React, Vite, and TailwindCSS. I wanted to make it look clean and responsive.
- **Backend:** I used Express.js for the API. 
  - I created a `ResearchService` that handles the main workflow. It calls my `FinancialDataService` and Tavily at the same time to speed things up.
  - The `FinancialDataService` tries to get data from Yahoo Finance first. If it can't find it (like for private companies), it falls back to Tavily to search the web for estimates. If all else fails, it just tells Gemini to rely on its own training data.
- **AI/LLM:** I used `@langchain/google-genai` to take all the context I gathered and send it to Google Gemini to write the final structured JSON report.

---

## Key Decisions & Trade-offs

### What I Chose and Why
- **Google Gemini:** I picked Gemini because it has a huge free-tier context window and is really good at reading long financial text and structuring the response properly.
- **Yahoo Finance + Tavily:** Yahoo Finance is awesome for public stocks, but it crashes on private companies. I decided to add Tavily so my app wouldn't break if someone searched for OpenAI or Stripe. This made the app way more versatile.
- **PostgreSQL + Prisma:** I went with a real database instead of a simple JSON file because I wanted to lay the groundwork for future features, like letting users log in and save their past reports.

### What I Left Out
- **Authentication:** To keep things simple and focus on the main AI requirements for the assignment, I didn't build a login system yet.
- **PDF Export:** I didn't add a button to download the report as a PDF because I wanted to focus entirely on getting the web UI right first.

---

## Example Runs
Here is what my agent output on a few companies I tested:
- **Apple Inc. (Public):** The agent easily pulled the real ticker, revenue, and stock price from Yahoo Finance. Gemini analyzed the data and pointed out that Apple relies a bit too much on iPhone sales, but noted their Services sector is a huge growth opportunity.
- **OpenAI (Private):** Yahoo Finance couldn't find a ticker, so the agent fell back to Tavily. It searched for recent valuations and revenue estimates. Gemini then wrote a report focusing on their massive growth and AI dominance, but correctly pointed out risks like high compute costs and open-source competitors.

## What I would improve with more time
- **Saving Reports:** I'd add a dashboard so users could save and look back at old reports.
- **Charts:** It would be really cool to use a library like Recharts to show stock price history on the frontend.
- **Multiple AI Agents:** Right now, I just send one big prompt to Gemini. With more time, I'd split this up so one agent does Risk Analysis, another does Financial Analysis, etc., and then combine their work for a better report.

## Bonus: LLM Chat Logs
I included the full transcript of my chat session with the LLM while I was building this project, as requested for the bonus points! You can find the file in this folder named `llm_chat_logs.jsonl`.

---

## Deployment

**Live Demo:** [invest-insight-ashy.vercel.app](https://invest-insight-ashy.vercel.app)
