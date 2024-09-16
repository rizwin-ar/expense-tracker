import { OpenAI } from "openai";
import { Entry } from "./AddEntryForm";

const openai = new OpenAI({
  apiKey: 'sk-P2_0KE9iVk1VGchg57Th34ZxzfFGtXPiD8WPEtW0KLT3BlbkFJtmV_5KKpOSJYNDrbdQtFpXFyOO5aAUrTBfWocoWdMA',
  dangerouslyAllowBrowser: true
});

export const generateAIReport = async (entries: Entry[]) => {
  const summary = entries
    .map((entry) => {
      return `On ${entry.date.format("YYYY-MM-DD")}, ${entry.type === 'income'
          ? `income of ${entry.amount} from ${entry.category}`
          : `expense of ${entry.amount} for ${entry.category}`
        }`;
    })
    .join(". ");

  const prompt = `
    Here is a summary of a user's income and expenses:
    ${summary}
    Can you analyze this data and generate a concise report on where the user can improve their expense management, and provide actionable recommendations?
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response from AI API");
    }
  } catch (error) {
    console.error("Error generating AI report:", error);
    return "There was an error generating the report.";
  }
};

