# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/landing.spec.ts >> Landing Page >> should not have console errors
- Location: tests/e2e/auth/landing.spec.ts:48:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

```
Error: write EPIPE
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e5]:
      - link "FLOPs logo FLOPs" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "FLOPs logo" [ref=e7]
        - generic [ref=e8]: FLOPs
      - generic [ref=e9]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Features" [ref=e11] [cursor=pointer]:
          - /url: /features
        - link "How It Works" [ref=e12] [cursor=pointer]:
          - /url: /how-it-works
        - link "AI Insights" [ref=e13] [cursor=pointer]:
          - /url: /ai-insights
        - link "Security" [ref=e14] [cursor=pointer]:
          - /url: /security
        - link "Dashboard" [ref=e15] [cursor=pointer]:
          - /url: /dashboard
      - link "Get Started" [ref=e19] [cursor=pointer]:
        - /url: /plan
    - generic [ref=e20]:
      - generic [ref=e21]: SMARTER MONEY. BETTER DECISIONS.
      - heading "Master your money. Not your stress." [level=1] [ref=e22]:
        - text: Master your money.
        - text: Not your stress.
      - paragraph [ref=e23]: FLOPs transforms your financial data into personalized insights, smarter budgets, and AI-powered recommendations—helping you spend wisely, save consistently, and achieve your goals with confidence.
      - generic [ref=e24]:
        - link "Get Started" [ref=e25] [cursor=pointer]:
          - /url: /plan
        - link "Explore Features" [ref=e26] [cursor=pointer]:
          - /url: /patterns
          - text: Explore Features
          - img [ref=e27]
  - generic [ref=e29]:
    - generic [ref=e30]:
      - generic [ref=e31]:
        - img [ref=e32]
        - generic [ref=e34]: AI-Powered Financial Intelligence
      - heading "Key Features" [level=2] [ref=e35]
      - paragraph [ref=e36]: Discover the intelligent tools that help you track spending, plan smarter, protect your data, and make confident financial decisions—all from one unified platform.
    - generic [ref=e37]:
      - generic [ref=e38]:
        - img "Unified Financial Dashboard" [ref=e40]
        - generic [ref=e41]:
          - heading "Unified Financial Dashboard" [level=3] [ref=e42]
          - paragraph [ref=e43]: Everything you need to manage your finances in one place.
      - generic [ref=e44]:
        - img "Cross-Device Experience" [ref=e46]
        - generic [ref=e47]:
          - heading "Cross-Device Experience" [level=3] [ref=e48]
          - paragraph [ref=e49]: Access your financial dashboard seamlessly across every device.
      - generic [ref=e50]:
        - img [ref=e52]:
          - img "CPU Logo" [ref=e90]
        - generic [ref=e91]:
          - heading "Explainable AI Insights" [level=3] [ref=e92]
          - paragraph [ref=e93]: Every recommendation comes with a clear explanation.
      - generic [ref=e94]:
        - img "Secure by Default" [ref=e96]
        - generic [ref=e97]:
          - heading "Secure by Default" [level=3] [ref=e98]
          - paragraph [ref=e99]: Bank-grade encryption keeps your financial data private.
      - generic [ref=e100]:
        - img [ref=e103]:
          - generic [ref=e1937]:
            - generic:
              - generic: Seoul
          - generic [ref=e1939]:
            - generic:
              - generic: NYC
          - generic [ref=e1941]:
            - generic:
              - generic: India
        - generic [ref=e1943]:
          - heading "Connected Financial View" [level=3] [ref=e1944]
          - paragraph [ref=e1945]: Bring all your accounts together in one unified dashboard.
  - generic [ref=e1947]:
    - generic [ref=e1948]:
      - generic [ref=e1949]:
        - img [ref=e1950]
        - generic [ref=e1953]: How It Works
      - heading "How AI Helps You Make Better Financial Decisions" [level=2] [ref=e1954]
      - paragraph [ref=e1955]: FLOPs securely analyzes your financial data, generates personalized insights, and helps you build healthier financial habits—all in just a few simple steps.
    - generic [ref=e1957]:
      - img
      - generic [ref=e1958]:
        - generic [ref=e1959]: Financial Input
        - generic [ref=e1960]:
          - img [ref=e1962]
          - generic [ref=e1964]:
            - heading "Bank Accounts" [level=4] [ref=e1965]
            - paragraph [ref=e1966]: Connect accounts securely.
        - generic [ref=e1967]:
          - img [ref=e1969]
          - generic [ref=e1972]:
            - heading "Income Sources" [level=4] [ref=e1973]
            - paragraph [ref=e1974]: Track recurring income.
        - generic [ref=e1975]:
          - img [ref=e1977]
          - generic [ref=e1980]:
            - heading "Monthly Expenses" [level=4] [ref=e1981]
            - paragraph [ref=e1982]: Categorize spending automatically.
        - generic [ref=e1983]:
          - img [ref=e1985]
          - generic [ref=e1989]:
            - heading "Financial Goals" [level=4] [ref=e1990]
            - paragraph [ref=e1991]: Define savings & investments.
      - generic [ref=e1992]:
        - generic [ref=e1994]:
          - text: Analyzing Financial Patterns
          - generic [ref=e1995]: ✓ AI Insights Generated
        - img [ref=e1999]
        - heading "AI Analysis Engine" [level=3] [ref=e2002]
        - paragraph [ref=e2003]: Analyzing Your Financial Data
      - generic [ref=e2004]:
        - generic [ref=e2005]: Personalized Results
        - generic [ref=e2006]:
          - img [ref=e2008]
          - generic [ref=e2011]:
            - heading "Smart Budget" [level=4] [ref=e2012]
            - paragraph [ref=e2013]: AI creates personalized budgets.
        - generic [ref=e2014]:
          - img [ref=e2016]
          - generic [ref=e2019]:
            - heading "Savings Plan" [level=4] [ref=e2020]
            - paragraph [ref=e2021]: Optimize monthly savings plan.
        - generic [ref=e2022]:
          - img [ref=e2024]
          - generic [ref=e2026]:
            - heading "Spending Insights" [level=4] [ref=e2027]
            - paragraph [ref=e2028]: Identify unnecessary costs.
        - generic [ref=e2029]:
          - img [ref=e2031]
          - generic [ref=e2034]:
            - heading "Financial Forecast" [level=4] [ref=e2035]
            - paragraph [ref=e2036]: Predict future financial trends.
  - generic [ref=e2037]:
    - generic [ref=e2038]:
      - generic [ref=e2039]:
        - img [ref=e2040]
        - generic [ref=e2043]: Trusted by Early Users
      - heading "Trusted by People Who Value Smarter Finances" [level=2] [ref=e2044]
      - paragraph [ref=e2045]: Discover how users are simplifying their financial lives with AI-powered insights, personalized planning, and secure financial guidance.
      - generic [ref=e2047]:
        - link [ref=e2048] [cursor=pointer]:
          - /url: https://github.com/dillionverma
        - link [ref=e2049] [cursor=pointer]:
          - /url: https://github.com/tomonarifeehan
        - link [ref=e2050] [cursor=pointer]:
          - /url: https://github.com/BankkRoll
        - link [ref=e2051] [cursor=pointer]:
          - /url: https://github.com/safethecode
        - link [ref=e2052] [cursor=pointer]:
          - /url: https://github.com/sanjay-mali
        - link [ref=e2053] [cursor=pointer]:
          - /url: https://github.com/itsarghyadas
        - generic [ref=e2054]: "+30"
    - generic [ref=e2055]:
      - generic [ref=e2056]:
        - generic [ref=e2058]:
          - img [ref=e2060]
          - generic [ref=e2063]:
            - generic [ref=e2064]:
              - generic [ref=e2065]:
                - img "Alex R." [ref=e2067]
                - generic [ref=e2069]:
                  - heading "Alex R." [level=4] [ref=e2070]
                  - paragraph [ref=e2071]: Graduate Student
              - paragraph [ref=e2072]: "\"FLOPs made budgeting feel effortless. The AI recommendations were simple, practical, and easy to follow.\""
            - generic [ref=e2073]:
              - generic [ref=e2074]:
                - img [ref=e2075]
                - img [ref=e2077]
                - img [ref=e2079]
                - img [ref=e2081]
                - img [ref=e2083]
              - generic [ref=e2085]: Student
        - generic [ref=e2087]:
          - img [ref=e2089]
          - generic [ref=e2092]:
            - generic [ref=e2093]:
              - generic [ref=e2094]:
                - img "Daniel K." [ref=e2096]
                - generic [ref=e2098]:
                  - heading "Daniel K." [level=4] [ref=e2099]
                  - paragraph [ref=e2100]: Software Engineer
              - paragraph [ref=e2101]: "\"Having all my accounts and financial goals in one dashboard has completely changed how I manage my finances.\""
            - generic [ref=e2102]:
              - generic [ref=e2103]:
                - img [ref=e2104]
                - img [ref=e2106]
                - img [ref=e2108]
                - img [ref=e2110]
                - img [ref=e2112]
              - generic [ref=e2114]: Engineer
        - generic [ref=e2116]:
          - img [ref=e2118]
          - generic [ref=e2121]:
            - generic [ref=e2122]:
              - generic [ref=e2123]:
                - img "Ethan C." [ref=e2125]
                - generic [ref=e2127]:
                  - heading "Ethan C." [level=4] [ref=e2128]
                  - paragraph [ref=e2129]: Business Analyst
              - paragraph [ref=e2130]: "\"Unlike other finance apps, FLOPs explains every recommendation instead of expecting me to trust a black box.\""
            - generic [ref=e2131]:
              - generic [ref=e2132]:
                - img [ref=e2133]
                - img [ref=e2135]
                - img [ref=e2137]
                - img [ref=e2139]
                - img [ref=e2141]
              - generic [ref=e2143]: Analyst
        - generic [ref=e2145]:
          - img [ref=e2147]
          - generic [ref=e2150]:
            - generic [ref=e2151]:
              - generic [ref=e2152]:
                - img "Jordan W." [ref=e2154]
                - generic [ref=e2156]:
                  - heading "Jordan W." [level=4] [ref=e2157]
                  - paragraph [ref=e2158]: Small Business Owner
              - paragraph [ref=e2159]: "\"Secure, transparent, and genuinely useful. FLOPs feels like having a personal financial coach available anytime.\""
            - generic [ref=e2160]:
              - generic [ref=e2161]:
                - img [ref=e2162]
                - img [ref=e2164]
                - img [ref=e2166]
                - img [ref=e2168]
                - img [ref=e2170]
              - generic [ref=e2172]: Business Owner
        - generic [ref=e2174]:
          - img [ref=e2176]
          - generic [ref=e2179]:
            - generic [ref=e2180]:
              - generic [ref=e2181]:
                - img "Alex R." [ref=e2183]
                - generic [ref=e2185]:
                  - heading "Alex R." [level=4] [ref=e2186]
                  - paragraph [ref=e2187]: Graduate Student
              - paragraph [ref=e2188]: "\"FLOPs made budgeting feel effortless. The AI recommendations were simple, practical, and easy to follow.\""
            - generic [ref=e2189]:
              - generic [ref=e2190]:
                - img [ref=e2191]
                - img [ref=e2193]
                - img [ref=e2195]
                - img [ref=e2197]
                - img [ref=e2199]
              - generic [ref=e2201]: Student
        - generic [ref=e2203]:
          - img [ref=e2205]
          - generic [ref=e2208]:
            - generic [ref=e2209]:
              - generic [ref=e2210]:
                - img "Daniel K." [ref=e2212]
                - generic [ref=e2214]:
                  - heading "Daniel K." [level=4] [ref=e2215]
                  - paragraph [ref=e2216]: Software Engineer
              - paragraph [ref=e2217]: "\"Having all my accounts and financial goals in one dashboard has completely changed how I manage my finances.\""
            - generic [ref=e2218]:
              - generic [ref=e2219]:
                - img [ref=e2220]
                - img [ref=e2222]
                - img [ref=e2224]
                - img [ref=e2226]
                - img [ref=e2228]
              - generic [ref=e2230]: Engineer
        - generic [ref=e2232]:
          - img [ref=e2234]
          - generic [ref=e2237]:
            - generic [ref=e2238]:
              - generic [ref=e2239]:
                - img "Ethan C." [ref=e2241]
                - generic [ref=e2243]:
                  - heading "Ethan C." [level=4] [ref=e2244]
                  - paragraph [ref=e2245]: Business Analyst
              - paragraph [ref=e2246]: "\"Unlike other finance apps, FLOPs explains every recommendation instead of expecting me to trust a black box.\""
            - generic [ref=e2247]:
              - generic [ref=e2248]:
                - img [ref=e2249]
                - img [ref=e2251]
                - img [ref=e2253]
                - img [ref=e2255]
                - img [ref=e2257]
              - generic [ref=e2259]: Analyst
        - generic [ref=e2261]:
          - img [ref=e2263]
          - generic [ref=e2266]:
            - generic [ref=e2267]:
              - generic [ref=e2268]:
                - img "Jordan W." [ref=e2270]
                - generic [ref=e2272]:
                  - heading "Jordan W." [level=4] [ref=e2273]
                  - paragraph [ref=e2274]: Small Business Owner
              - paragraph [ref=e2275]: "\"Secure, transparent, and genuinely useful. FLOPs feels like having a personal financial coach available anytime.\""
            - generic [ref=e2276]:
              - generic [ref=e2277]:
                - img [ref=e2278]
                - img [ref=e2280]
                - img [ref=e2282]
                - img [ref=e2284]
                - img [ref=e2286]
              - generic [ref=e2288]: Business Owner
      - generic [ref=e2289]:
        - generic [ref=e2291]:
          - img [ref=e2293]
          - generic [ref=e2296]:
            - generic [ref=e2297]:
              - generic [ref=e2298]:
                - img "Sarah L." [ref=e2300]
                - generic [ref=e2302]:
                  - heading "Sarah L." [level=4] [ref=e2303]
                  - paragraph [ref=e2304]: Marketing Professional
              - paragraph [ref=e2305]: "\"I finally understand where my money goes each month. The explainable AI insights make every recommendation easy to trust.\""
            - generic [ref=e2306]:
              - generic [ref=e2307]:
                - img [ref=e2308]
                - img [ref=e2310]
                - img [ref=e2312]
                - img [ref=e2314]
                - img [ref=e2316]
              - generic [ref=e2318]: Professional
        - generic [ref=e2320]:
          - img [ref=e2322]
          - generic [ref=e2325]:
            - generic [ref=e2326]:
              - generic [ref=e2327]:
                - img "Priya M." [ref=e2329]
                - generic [ref=e2331]:
                  - heading "Priya M." [level=4] [ref=e2332]
                  - paragraph [ref=e2333]: Product Designer
              - paragraph [ref=e2334]: "\"The personalized savings suggestions helped me stay consistent without feeling overwhelmed.\""
            - generic [ref=e2335]:
              - generic [ref=e2336]:
                - img [ref=e2337]
                - img [ref=e2339]
                - img [ref=e2341]
                - img [ref=e2343]
                - img [ref=e2345]
              - generic [ref=e2347]: Designer
        - generic [ref=e2349]:
          - img [ref=e2351]
          - generic [ref=e2354]:
            - generic [ref=e2355]:
              - generic [ref=e2356]:
                - img "Maya T." [ref=e2358]
                - generic [ref=e2360]:
                  - heading "Maya T." [level=4] [ref=e2361]
                  - paragraph [ref=e2362]: Freelance Consultant
              - paragraph [ref=e2363]: "\"The clean interface and intelligent planning tools make financial management surprisingly enjoyable.\""
            - generic [ref=e2364]:
              - generic [ref=e2365]:
                - img [ref=e2366]
                - img [ref=e2368]
                - img [ref=e2370]
                - img [ref=e2372]
                - img [ref=e2374]
              - generic [ref=e2376]: Consultant
        - generic [ref=e2378]:
          - img [ref=e2380]
          - generic [ref=e2383]:
            - generic [ref=e2384]:
              - generic [ref=e2385]:
                - img "Sarah L." [ref=e2387]
                - generic [ref=e2389]:
                  - heading "Sarah L." [level=4] [ref=e2390]
                  - paragraph [ref=e2391]: Marketing Professional
              - paragraph [ref=e2392]: "\"I finally understand where my money goes each month. The explainable AI insights make every recommendation easy to trust.\""
            - generic [ref=e2393]:
              - generic [ref=e2394]:
                - img [ref=e2395]
                - img [ref=e2397]
                - img [ref=e2399]
                - img [ref=e2401]
                - img [ref=e2403]
              - generic [ref=e2405]: Professional
        - generic [ref=e2407]:
          - img [ref=e2409]
          - generic [ref=e2412]:
            - generic [ref=e2413]:
              - generic [ref=e2414]:
                - img "Priya M." [ref=e2416]
                - generic [ref=e2418]:
                  - heading "Priya M." [level=4] [ref=e2419]
                  - paragraph [ref=e2420]: Product Designer
              - paragraph [ref=e2421]: "\"The personalized savings suggestions helped me stay consistent without feeling overwhelmed.\""
            - generic [ref=e2422]:
              - generic [ref=e2423]:
                - img [ref=e2424]
                - img [ref=e2426]
                - img [ref=e2428]
                - img [ref=e2430]
                - img [ref=e2432]
              - generic [ref=e2434]: Designer
        - generic [ref=e2436]:
          - img [ref=e2438]
          - generic [ref=e2441]:
            - generic [ref=e2442]:
              - generic [ref=e2443]:
                - img "Maya T." [ref=e2445]
                - generic [ref=e2447]:
                  - heading "Maya T." [level=4] [ref=e2448]
                  - paragraph [ref=e2449]: Freelance Consultant
              - paragraph [ref=e2450]: "\"The clean interface and intelligent planning tools make financial management surprisingly enjoyable.\""
            - generic [ref=e2451]:
              - generic [ref=e2452]:
                - img [ref=e2453]
                - img [ref=e2455]
                - img [ref=e2457]
                - img [ref=e2459]
                - img [ref=e2461]
              - generic [ref=e2463]: Consultant
    - button "Share Your Experience" [ref=e2465]
  - generic [ref=e2466]:
    - generic [ref=e2467]:
      - generic [ref=e2468]:
        - img [ref=e2469]
        - generic [ref=e2472]: Frequently Asked Questions
      - heading "Frequently Asked Questions" [level=2] [ref=e2473]
      - paragraph [ref=e2474]: Everything you need to know about FLOPs, your AI-powered financial companion.
    - generic [ref=e2475]:
      - generic [ref=e2476]:
        - generic [ref=e2478] [cursor=pointer]:
          - heading "What is FLOPs?" [level=4] [ref=e2479]
          - img [ref=e2482]
        - generic [ref=e2484] [cursor=pointer]:
          - heading "Is my financial data secure?" [level=4] [ref=e2485]
          - img [ref=e2488]
        - generic [ref=e2490] [cursor=pointer]:
          - heading "How does the AI explain its recommendations?" [level=4] [ref=e2491]
          - img [ref=e2494]
        - generic [ref=e2496] [cursor=pointer]:
          - heading "Is FLOPs suitable for beginners?" [level=4] [ref=e2497]
          - img [ref=e2500]
      - generic [ref=e2501]:
        - generic [ref=e2503] [cursor=pointer]:
          - heading "How does FLOPs personalize financial recommendations?" [level=4] [ref=e2504]
          - img [ref=e2507]
        - generic [ref=e2509] [cursor=pointer]:
          - heading "Can I connect multiple bank accounts?" [level=4] [ref=e2510]
          - img [ref=e2513]
        - generic [ref=e2515] [cursor=pointer]:
          - heading "Can I track my savings goals?" [level=4] [ref=e2516]
          - img [ref=e2519]
  - generic [ref=e2521]:
    - generic:
      - img
    - generic:
      - img
    - generic:
      - img
    - generic:
      - img
    - generic:
      - img
    - generic:
      - img
    - generic [ref=e2522]:
      - generic [ref=e2523]:
        - img [ref=e2524]
        - generic [ref=e2526]: Start Your Financial Journey
      - heading "Ready to Take Control of Your Finances ?" [level=2] [ref=e2527]:
        - text: Ready to Take Control
        - text: of Your
        - generic [ref=e2528]: Finances
        - text: "?"
      - paragraph [ref=e2530]: Join FLOPs today and let AI help you budget smarter, save consistently, and build healthier financial habits with confidence.
      - generic [ref=e2531]:
        - button "Get Started" [ref=e2532]:
          - text: Get Started
          - img [ref=e2533]
        - button "Explore Features" [ref=e2535]
      - generic [ref=e2536]:
        - generic [ref=e2537]:
          - img "User" [ref=e2538]
          - img "User" [ref=e2539]
          - img "User" [ref=e2540]
          - img "User" [ref=e2541]
          - img "User" [ref=e2542]
        - paragraph [ref=e2544]: Trusted by 12,000+ users building healthier financial habits.
  - generic [ref=e2549] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e2550]:
      - img [ref=e2551]
    - generic [ref=e2554]:
      - button "Open issues overlay" [ref=e2555]:
        - generic [ref=e2556]:
          - generic [ref=e2557]: "0"
          - generic [ref=e2558]: "1"
        - generic [ref=e2559]: Issue
      - button "Collapse issues badge" [ref=e2560]:
        - img [ref=e2561]
  - alert [ref=e2563]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { LandingPage } from "../pages/LandingPage";
  3  | 
  4  | test.describe("Landing Page", () => {
  5  |   let landing: LandingPage;
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     landing = new LandingPage(page);
  9  |     await landing.goto();
  10 |   });
  11 | 
  12 |   test("should load landing page successfully", async () => {
  13 |     await landing.assertHeroSectionVisible();
  14 |     await landing.assertNavigationVisible();
  15 |   });
  16 | 
  17 |   test("should display feature sections", async () => {
  18 |     await landing.assertFeaturesSectionVisible();
  19 |   });
  20 | 
  21 |   test("should display FAQ section", async () => {
  22 |     await landing.scrollToFAQ();
  23 |     await landing.assertFAQSectionVisible();
  24 |   });
  25 | 
  26 |   test("should display CTA section", async () => {
  27 |     await landing.assertCTASectionVisible();
  28 |   });
  29 | 
  30 |   test("should navigate to signup on CTA click", async ({ page }) => {
  31 |     await landing.clickGetStarted();
  32 |     await page.waitForURL(/\/plan|\/auth\/(signup|login)/);
  33 |     expect(page.url()).toMatch(/plan|signup|login/);
  34 |   });
  35 | 
  36 |   test("should have working navigation links", async ({ page }) => {
  37 |     const homeLink = page.locator("nav a").first();
  38 |     await expect(homeLink).toBeVisible();
  39 |   });
  40 | 
  41 |   test("should be responsive", async ({ page }) => {
  42 |     await page.setViewportSize({ width: 375, height: 812 });
  43 |     await landing.goto();
  44 |     await landing.assertHeroSectionVisible();
  45 |     await landing.assertFeaturesSectionVisible();
  46 |   });
  47 | 
  48 |   test("should not have console errors", async ({ page }) => {
  49 |     const errors: string[] = [];
  50 |     page.on("console", (msg) => {
  51 |       if (msg.type() === "error") errors.push(msg.text());
  52 |     });
  53 |     await landing.goto();
  54 |     await page.waitForLoadState("networkidle");
  55 |     await page.waitForTimeout(1000);
  56 |     const filtered = errors.filter(
  57 |       (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("MongoServerSelectionError")
  58 |     );
  59 |     if (filtered.length > 0) {
  60 |       console.log("Console errors found:", JSON.stringify(filtered, null, 2));
  61 |     }
> 62 |     expect(filtered.length).toBe(0);
     |                             ^ Error: write EPIPE
  63 |   });
  64 | });
  65 | 
```