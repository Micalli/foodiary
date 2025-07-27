import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import { Readable } from "node:stream";
import { s3Client } from "../clients/s3Client";
import { db } from "../db";
import { mealsTable } from "../db/schema";
// import { tmpdir } from "os";
// import { join } from "path";
// import { writeFile, readFile, unlink } from "fs/promises";
import {
  getMealDetailsFromImage,
  getMealDetailsFromMealText,
  getMealDetailsFromText,
  transcribeAudio,
} from "../services/ai";

// import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
// import ffmpeg from "fluent-ffmpeg";

// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class ProcessMeal {
  // private static async speedUpAudio(
  //   audioBuffer: Buffer,
  //   speed = 2
  // ): Promise<Buffer> {
  //   const inputPath = join(tmpdir(), `input-${Date.now()}.m4a`);
  //   const outputPath = join(tmpdir(), `output-${Date.now()}.m4a`);

  //   await writeFile(inputPath, audioBuffer);

  //   return new Promise((resolve, reject) => {
  //     ffmpeg(inputPath)
  //       .audioFilter(`atempo=${speed}`)
  //       .output(outputPath)
  //       .audioCodec("aac") // garante compatibilidade com m4a
  //       .on("end", async () => {
  //         const processedBuffer = await readFile(outputPath);
  //         await unlink(inputPath);
  //         await unlink(outputPath);
  //         resolve(processedBuffer);
  //       })
  //       .on("error", (err) => reject(err))
  //       .run();
  //   });
  // }

  static async process({
    fileKey,
    text,
    mealId,
  }: {
    fileKey: string;
    mealId: string;
    text?: string;
  }) {
    console.log("🚀 ~ ProcessMeal ~ process ~ fileKey:", fileKey);
    if ((fileKey === "text")) {
      console.log("🚀 ~ ProcessMeal ~ process ~ text:", text);
      return await this.processText({ mealId, text });
    }
    return await this.processBufferOrImage({ fileKey });
  }

  private static async processBufferOrImage({ fileKey }: { fileKey: string }) {
    console.log("🚀 ~ ProcessMeal ~ processBufferOrImage ~ fileKey:", fileKey)
      const meal = await db.query.mealsTable.findFirst({
        where: eq(mealsTable.inputFileKey, fileKey),
      });

      if (!meal) {
        throw new Error("Meal not found.");
      }

      if (meal.status === "failed" || meal.status === "success") {
        return;
      }
    try { 
      await db
        .update(mealsTable)
        .set({ status: "processing" })
        .where(eq(mealsTable.id, meal.id));

      let icon = "";
      let name = "";
      let foods = [];

      if (meal.inputType === "audio") {
        const audioFileBuffer = await this.downloadAudioFile(meal.inputFileKey);

        // const processedAudioBuffer = await this.speedUpAudio(
        //   audioFileBuffer,
        //   2
        // );
        const transcription = await transcribeAudio(audioFileBuffer);

        const mealDetails = await getMealDetailsFromText({
          createdAt: new Date(),
          text: transcription,
        });

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }

      if (meal.inputType === "picture") {
        try {
          const imageURL = await this.getImageURL(meal.inputFileKey);

          const mealDetails = await getMealDetailsFromImage({
            createdAt: meal.createdAt,
            imageURL,
          });

          icon = mealDetails.icon;
          name = mealDetails.name;
          foods = mealDetails.foods;
        } catch (error) {
          console.log("🚀 ~ ProcessMeal ~ process ~ error:", error);
          await db
            .update(mealsTable)
            .set({ status: "failed" })
            .where(eq(mealsTable.id, meal.id));
        }
      }

      await db
        .update(mealsTable)
        .set({
          status: "success",
          name,
          icon,
          foods,
        })
        .where(eq(mealsTable.id, meal.id));
    } catch (error) {
      console.log("error ProcessMeal", error);

      await db
        .update(mealsTable)
        .set({ status: "failed" })
        .where(eq(mealsTable.id, meal.id));
    }
  }

  private static async processText({
    mealId,
    text,
  }: {
    mealId: string;
    text?: string;
  }) {
    const meal = await db.query.mealsTable.findFirst({
      where: eq(mealsTable.id, mealId),
    });

    if (!meal) {
      throw new Error("Meal not found.");
    }

    if (meal.status === "failed" || meal.status === "success") {
      return;
    }

    await db
      .update(mealsTable)
      .set({ status: "processing" })
      .where(eq(mealsTable.id, meal.id));

    try {
      let icon = "";
      let name = "";
      let foods = [];

      try {
        console.log("aqqq123123123");

        const mealDetails = await getMealDetailsFromMealText({
          createdAt: meal.createdAt,
          mealText: text || "",
          meaId: meal.id,
        });

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      } catch (error) {
        console.log("🚀 ~ ProcessMeal ~ processText ~ error:", error);
            console.log("🚀 ~ ProcessMeal ~ processText ~ meal.id:", meal.id);

         const res =  await db
            .update(mealsTable)
            .set({ status: "failed" })
            .where(eq(mealsTable.id, meal.id));
         console.log("🚀 ~ ProcessMeal ~ processText ~ res:", res)

         return
      }

      await db
        .update(mealsTable)
        .set({
          status: "success",
          name,
          icon,
          foods,
        })
        .where(eq(mealsTable.id, meal.id));
    } catch (error) {
      console.log("error ProcessMeal", error);

      await db
        .update(mealsTable)
        .set({ status: "failed" })
        .where(eq(mealsTable.id, meal.id));
    }
  }

  private static async downloadAudioFile(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const { Body } = await s3Client.send(command);

    if (!Body || !(Body instanceof Readable)) {
      throw new Error("Cannot load the audio file.");
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  private static async getImageURL(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    return getSignedUrl(s3Client, command, { expiresIn: 600 });
  }
}
