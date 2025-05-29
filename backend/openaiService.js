const OpenAI = require("openai");

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async parseTask(taskText) {
    const currentDate = new Date();
    const systemPrompt = `You are a task parsing assistant that extracts structured data from natural language task descriptions. Your job is to identify:

1. Task title (the main action/work to be done)
2. Assignee (the person responsible for the task)
3. Due date and time
4. Priority level (P1, P2, P3, or P4)

Guidelines for extraction:
- ALWAYS try to identify a person's name as the assignee, even if not explicitly marked with "by" or "for"
- If no priority is specified, default to P3
- Format dates as ISO strings with the following rules:
  * For explicit dates with year (e.g., "June 20, 2025"), use that exact year
  * For relative dates ("today", "tomorrow", "next Monday"), calculate from ${currentDate.toISOString()}
  * For dates without year (e.g., "June 20"), use the current year (${currentDate.getFullYear()})
  * Always include time in the ISO string (default to 00:00:00 if no time specified)
- If a component is not found, use null

Example inputs and expected date handling:
✓ "Meeting tomorrow 3pm" → dueDate: calculate tomorrow at 15:00 from current date
✓ "Review by June 20th 2pm" → dueDate: "${currentDate.getFullYear()}-06-20T14:00:00"
✓ "Submit by Dec 31, 2025" → dueDate: "2025-12-31T00:00:00"
✓ "Call today at 4pm" → dueDate: calculate today at 16:00
✓ "Meeting next Monday 10am" → dueDate: calculate next Monday at 10:00

Example outputs:
{
  "title": "Review presentation",
  "assignee": "Sarah",
  "dueDate": "2024-05-29T15:00:00",
  "priority": "P2"
}

You must respond with valid JSON containing these exact keys: title, assignee, dueDate, priority`;

    const userPrompt = `Parse this task and extract the components according to the guidelines. Current date/time is: ${currentDate.toISOString()}

Task: "${taskText}"`;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content);

      // Post-process the date to ensure correct handling
      if (result.dueDate) {
        const dueDate = new Date(result.dueDate);

        // If the date is invalid, try to fix it
        if (isNaN(dueDate.getTime())) {
          console.warn("Invalid date received from OpenAI:", result.dueDate);
          result.dueDate = null;
        } else {
          // Ensure the year is current year if not explicitly specified in input
          const hasExplicitYear = taskText.includes(
            dueDate.getFullYear().toString()
          );
          if (!hasExplicitYear) {
            dueDate.setFullYear(currentDate.getFullYear());

            // If the resulting date is in the past (e.g., "Dec 25" in January),
            // increment the year by 1
            if (
              dueDate < currentDate &&
              !taskText.toLowerCase().includes("today")
            ) {
              dueDate.setFullYear(currentDate.getFullYear() + 1);
            }
          }

          result.dueDate = dueDate.toISOString();
        }
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return {
        success: false,
        error: "Failed to parse task",
      };
    }
  }
}

module.exports = new OpenAIService();
