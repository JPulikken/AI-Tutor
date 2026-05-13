import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateReport = async (data) => {
  const prompt = `
  Emotions: ${JSON.stringify(data.emotions)}
  Exercises: ${JSON.stringify(data.exercises)}

  Give a simple summary for parents.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};