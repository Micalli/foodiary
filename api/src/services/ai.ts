import OpenAI, { toFile } from "openai";
import { toZonedTime } from "date-fns-tz";
import { mealsTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
const client = new OpenAI();

const prompIa = `
  Seu papel é:
          1. Dar um nome e escolher um emoji para a refeição baseado no horário dela.
          2. Identificar os alimentos presentes na imagem.
          3. Estimar, para cada alimento identificado:
            - Nome do alimento (em português)
            - Quantidade aproximada (em gramas ou unidades)
            - Calorias (kcal)
            - Carboidratos (g)
            - Proteínas (g)
            - Gorduras (g)

            REGRAS IMPORTANTES:
            - Se a mensagem não contiver informações sobre alimentos ou refeições, **retorne exatamente a string**: json${"```"} INVALID_INPUT ${"```"}
            - Retorne **apenas** um JSON válido, sem texto antes ou depois.
            - **Não inclua blocos de código, markdown, labels (ex.: ${"```"}json), comentários ou explicações.**
            - Use exatamente o formato:

          {
            "name": "Jantar",
            "icon": "🍗",
            "foods": [
              {
                "name": "Arroz branco cozido",
                "quantity": "150g",
                "calories": 193,
                "carbohydrates": 42,
                "proteins": 3.5,
                "fats": 0.4
              },
              {
                "name": "Peito de frango grelhado",
                "quantity": "100g",
                "calories": 165,
                "carbohydrates": 0,
                "proteins": 31,
                "fats": 3.6
              }
            ]
          }`;

export async function transcribeAudio(file: Buffer) {
  const transcription = await client.audio.transcriptions.create({
    model: "whisper-1",
    language: "pt",
    response_format: "text",
    file: await toFile(file, "audio.m4a", { type: "audio/m4a" }),
  });
  console.log("🚀 ~ transcribeAudio ~ transcription:", transcription);
  // sls logs -f processMeal -t  sls deploy function -f processMeal
  return transcription;
}

type GetMealDetailsFromTextParams = {
  text: string;
  createdAt: Date;
};

export async function getMealDetailsFromText({
  createdAt,
  text,
}: GetMealDetailsFromTextParams) {
  try {
    const saoPauloDate = toZonedTime(createdAt, "America/Sao_Paulo");
    console.log("🚀 ~ getMealDetailsFromText ~ saoPauloDate:", saoPauloDate);
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
          Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.

          ${prompIa}
        `,
        },
        {
          role: "user",
          content: `
          Data: ${saoPauloDate}
          Refeição: ${text}
        `,
        },
      ],
    });

    const json = response.choices[0].message.content;

    if (!json) {
      throw new Error("Failed to process meal.");
    }

    return JSON.parse(json);
  } catch (error) {
    console.log("🚀 ~ getMealDetailsFromText ~ error:", error);
  }
}

type GetMealDetailsFromImageParams = {
  imageURL: string;
  createdAt: Date;
};

export async function getMealDetailsFromImage({
  createdAt,
  imageURL,
}: GetMealDetailsFromImageParams) {
  try {
    const saoPauloDate = toZonedTime(createdAt, "America/Sao_Paulo");
    console.log("🚀 ~ getMealDetailsFromText ~ saoPauloDate:", saoPauloDate);
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
          Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.

          ${prompIa}
        `,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageURL,
              },
            },
          ],
        },
      ],
    });
    console.log("🚀 ~ getMealDetailsFromImage ~ response:", response);

    const json = response.choices[0].message.content;
    console.log("🚀 ~ getMealDetailsFromImage ~ json:", json);

    if (!json) {
      throw new Error("Failed to process meal.");
    }

    return JSON.parse(json);
  } catch (error) {
    console.log("🚀 ~ getMealDetailsFromImage ~ error:", error);
  }
}

type GetMealDetailsFromTestMElaParams = {
  mealText: string;
  meaId: string;
  createdAt: Date;
};

const prompAgent = `
          Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.

          Seu papel é:
          1. Dar um nome e escolher um emoji para a refeição baseado no horário dela.
          2. Identificar os alimentos presentes na imagem.
          3. Estimar, para cada alimento identificado:
            - Nome do alimento (em português)
            - Quantidade aproximada (em gramas ou unidades)
            - Calorias (kcal)
            - Carboidratos (g)
            - Proteínas (g)
            - Gorduras (g)

          Seja direto, objetivo e evite explicações. Apenas retorne os dados em JSON no formato abaixo:

          {
            "name": "Jantar",
            "icon": "🍗",
            "foods": [
              {
                "name": "Arroz branco cozido",
                "quantity": "150g",
                "calories": 193,
                "carbohydrates": 42,
                "proteins": 3.5,
                "fats": 0.4
              },
              {
                "name": "Peito de frango grelhado",
                "quantity": "100g",
                "calories": 165,
                "carbohydrates": 0,
                "proteins": 31,
                "fats": 3.6
              }
            ]
          }
        `;
export async function getMealDetailsFromMealText({
  createdAt,
  mealText,
  meaId,
}: GetMealDetailsFromTestMElaParams) {
  const saoPauloDate = toZonedTime(createdAt, "America/Sao_Paulo");
  console.log("🚀 ~ getMealDetailsFromText ~ saoPauloDate:", saoPauloDate);
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
          Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.

          ${prompIa}
        `,
        },
        {
          role: "user",
          content: `
          Data: ${saoPauloDate}
          Refeição: ${mealText}
        `,
        },
      ],
    });
    console.log("🚀 ~ getMealDetailsFromImage ~ response:", response);

    const json = response.choices[0].message.content;
    console.log("🚀 ~ getMealDetailsFromImage ~ json:", json);

    if (!json) {
      throw new Error("Failed to process meal.");
    }

    return JSON.parse(json);
  } catch (error) {
    console.log("🚀 ~ getMealDetailsFromImage ~ error:!@#!@#!@#", error);
    console.log("🚀 ~ getMealDetailsFromMealText ~ meaId:", meaId);
    const res = await db
      .update(mealsTable)
      .set({ status: "failed" })
      .where(eq(mealsTable.id, meaId));
    console.log("🚀 ~ ProcessMeal ~ processText ~ res:", res);
  }
}
