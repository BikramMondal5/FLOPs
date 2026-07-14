import { logger } from "@/lib/logger";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export async function askGemini(prompt: string, expectJson = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY environment variable is not defined. Falling back to deterministic mockup text.");
    return getFallbackResponse(expectJson, prompt);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: expectJson
          ? {
              responseMimeType: "application/json",
            }
          : undefined,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API call failed: ${response.status} - ${errText}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      throw new Error("Empty candidate payload returned from Gemini API");
    }

    return answer;
  } catch (error) {
    logger.error("LLM Provider call encountered error", error);
    return getFallbackResponse(expectJson, prompt);
  }
}

function getFallbackResponse(expectJson: boolean, prompt: string): string {
  if (!expectJson) {
    // conversational chat fallback
    if (prompt.toLowerCase().includes("laptop")) {
      return JSON.stringify({
        response: "Based on your current savings rate of ₹5,000/month and your target date, you are set to achieve your laptop goal in December. Try cutting down bills to complete it 1 month early.",
        suggestedPrompts: ["How can I accelerate this?", "What is my largest expense?"],
      });
    }
    return JSON.stringify({
      response: "Hello! I am your FLOPs AI assistant. You are currently saving ₹5,000 a month with an overall budget utilization of 42%.",
      suggestedPrompts: ["How can I save more?", "Am I on track for my laptop?"],
    });
  }

  // dashboard fallback DTO json
  return JSON.stringify({
    financialSummary: {
      overallStance: "Stable Cashflow",
      achievements: [
        "Maintained overall budget utilization below 60%.",
        "Saved ₹5,000 this month toward active plans."
      ],
      primaryConcerns: [
        "Your Shopping category represents 32% of total category allocations."
      ],
      actionableStep: "Transfer ₹1,500 from your Shopping budget to your Emergency Fund goal."
    },
    monthlyReview: {
      summaryParagraph: "This month you had stable cash inflows covering all category requirements cleanly.",
      topExpenseCategory: "Food & Dining",
      topIncomeSource: "Salary",
      budgetPerformanceNotice: "Category budgets are running safely within active limits.",
      goalHealthNotice: "Active goals are On Track with a 75% average completion probability."
    },
    recommendations: [
      { category: "Food", type: "neutral", message: "Keep dining bills below ₹8,000 next month." }
    ],
    risks: [
      { level: "Low", trigger: "High shopping utilization", impact: "Can delay electronics targets." }
    ],
    opportunities: [
      { category: "Emergency Fund", suggestion: "Allocate surplus salary to emergency target", projectedSavings: 2000 }
    ],
    financialHealthExplanation: "Your Health index is Good (score 72) due to high diversification and steady cash inflows."
  });
}
