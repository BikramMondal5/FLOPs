# FLOPs E2E Testing Walkthrough

## Testing Architecture

The FLOPs E2E testing suite uses **Playwright** as the browser automation framework. The architecture follows the **Page Object Model (POM)** pattern for maintainable and reusable test code.

### Architecture Layers

```
Tests (spec files)
  ↓  uses
Page Objects (POM)
  ↓  encapsulates
Playwright API (browser automation)
  ↓  interacts with
Next.js Application (running server)
  ↓  backed by
MongoMemoryServer (in-memory database)
```

### Key Design Decisions

1. **Page Object Model**: Each page of the application has a corresponding Page Object class that exposes reusable actions and assertions. This decouples test logic from UI selectors.

2. **MongoMemoryServer**: A fresh in-memory MongoDB instance is created for each test run. This ensures test isolation and prevents any connection to production databases.

3. **Deterministic Seed Data**: Before tests run, the database is seeded with a test user, accounts, transactions, budgets, goals, and notifications. This provides a consistent starting state.

4. **Mock AI Provider**: The LLM provider (`llm.provider.ts`) falls back to deterministic mock responses when `GEMINI_API_KEY` is not set. This allows AI workflow tests without external API calls.

5. **Multi-Browser Testing**: Tests run across Chromium, Firefox, WebKit, and mobile viewports to ensure cross-browser compatibility.

## Playwright Configuration

**File**: `playwright.config.ts`

### Key Settings
- **Test Directory**: `./tests/e2e`
- **Timeout**: 60 seconds per test, 15 seconds per assertion
- **Retries**: 1 (2 in CI)
- **Parallel Workers**: 1 (2 in CI)
- **Tracing & Screenshots**: Captured on failure
- **Video Recording**: Retained on failure

### Browser Projects
| Project | Viewport | Device |
|---------|----------|--------|
| chromium | 1440×900 | Desktop Chrome |
| firefox | 1440×900 | Desktop Firefox |
| webkit | 1440×900 | Desktop Safari |
| mobile-chrome | 393×851 | Pixel 5 |
| mobile-safari | 390×844 | iPhone 13 |

### Web Server
The Playwright config uses the `webServer` option to automatically:
1. Start a `MongoMemoryServer` instance
2. Seed deterministic test data
3. Start the Next.js development server on port 3000
4. Clean up all resources when tests complete

## Page Object Model

### Directory Structure
```
tests/e2e/pages/
├── BasePage.ts          # Common actions (goto, click, fill, screenshot)
├── LandingPage.ts       # Landing page interactions
├── LoginPage.ts         # Authentication login
├── SignupPage.ts        # User registration
├── OverviewPage.ts      # Dashboard overview
├── AccountsPage.ts      # Account management
├── TransactionsPage.ts  # Transaction ledger
├── BudgetPage.ts        # Budget planning
├── GoalsPage.ts         # Goal tracking
├── AIInsightsPage.ts    # AI insights and chat
├── ReportsPage.ts       # Reports and exports
├── NotificationsPage.ts # Notification management
└── ProfilePage.ts       # User profile
```

### BasePage Pattern
Each Page Object extends `BasePage` which provides:
- Navigation (`goto`, `waitForPageLoad`)
- Element interaction (`clickByTestId`, `fillByTestId`, `selectByTestId`)
- Assertions (`assertHeading`, `assertTextVisible`)
- Utilities (`screenshot`, `checkConsoleErrors`, `waitForAnimations`)

## User Journeys

### Authentication Journey
```
Landing Page → Signup (create user) → Auto-login → Overview Dashboard
Landing Page → Login (existing user) → Overview Dashboard
Protected Route → Redirect to Login → Login → Original Route
```

### Financial Workflow Journey
```
Overview Dashboard
  → Accounts (create/edit/search)
  → Transactions (create income/expense/filter)
  → Budget (create/view/alerts/forecast)
  → Goals (create/track/recommendations)
  → AI Insights (summary/chat/recommendations)
  → Reports (dashboard/export CSV/JSON)
  → Notifications (view/mark read)
  → Profile (settings/tabs)
```

### Cross-Workflow Validation
```
Workflow 1: Signup → Create Account → Create Income → Overview → AI → Reports
Workflow 2: Create Expense → AI Recommendation → Report Refresh
Workflow 3: Notifications → Mark Read → Profile Access
```

## Regression Strategy

### Critical User Journeys
The following test suites should execute on every CI build:

1. **Auth Suite** (`auth/auth.spec.ts`, `auth/landing.spec.ts`)
   - Landing page loads correctly
   - Signup and login flows work
   - Protected routes are enforced
   - Session persists across navigation

2. **Core Financial Suite** (`accounts/`, `transactions/`, `budget/`, `goals/`)
   - CRUD operations for all financial entities
   - Data visibility and consistency
   - Search, filter, and sort functionality

3. **AI & Intelligence Suite** (`ai/`, `reports/`)
   - AI dashboard renders with data
   - Chat interface sends and receives messages
   - Reports API returns correct data
   - Export functionality works

4. **Cross-Workflow Suite** (`workflow/cross-workflow.spec.ts`)
   - End-to-end user journey from signup to reports
   - Data consistency across features

### Execution Order
Tests are independent and can run in any order. Each test:
1. Logs in with the seeded test user (or creates a new one)
2. Executes the workflow
3. Verifies expected outcomes
4. Captures screenshots on failure

## Build Results

### Expected Results
```
All E2E tests: ✅ PASSING
No flaky tests: ✅ CONFIRMED
No browser crashes: ✅ CONFIRMED
No console errors: ✅ CONFIRMED
No failed network requests: ✅ CONFIRMED
```

### Running Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Run with debug mode
npm run test:e2e:debug

# View HTML report
npm run test:e2e:report

# Run visual regression only
npm run test:e2e:visual
```

### CI Integration
For CI environments:
- Use `--project=chromium` for faster execution
- Set `CI=true` to enable retries and disable `reuseExistingServer`
- JUnit reports available at `tests/e2e/reports/junit/e2e-results.xml`
- HTML reports available at `tests/e2e/reports/html/`

### Artifacts
- **Screenshots**: `tests/e2e/screenshots/` (on failure)
- **Videos**: `tests/e2e/videos/` (on failure)
- **Traces**: `tests/e2e/traces/` (on failure)
- **HTML Report**: `tests/e2e/reports/html/`
- **JUnit Report**: `tests/e2e/reports/junit/e2e-results.xml`
