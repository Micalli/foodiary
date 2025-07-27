import { badRequest, created, ok } from "../utils/http";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import z from "zod";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { s3Client } from "../clients/s3Client";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../clients/sqsClient";

const schema = z.object({
  fileType: z.enum(["audio/m4a", "image/jpeg", "text"]),
  text: z.string().optional(), 
});

export class CreateMealController {
  static async handler({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);
    console.log("🚀 ~ CreateMealController ~ handler ~ data:", data);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    if (data.fileType != "text") {
      const fileId = randomUUID();
      const ext = data.fileType === "audio/m4a" ? ".m4a" : ".jpeg";
      const fileKey = `${fileId}${ext}`;

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
      });

      const presignedURL = await getSignedUrl(s3Client, command, {
        expiresIn: 600,
      });

      const [meal] = await db
        .insert(mealsTable)
        .values({
          userId,
          inputFileKey: fileKey,
          inputType:
            data.fileType === "audio/m4a"
              ? "audio"
              : data.fileType === "image/jpeg"
              ? "picture"
              : "text",
          status: "uploading",
          name: "",
          icon: "",
          foods: [],
        })
        .returning({
          id: mealsTable.id,
        });

      return created({
        uploadURL: presignedURL,
        mealId: meal.id,
      });
    }
    try {
      console.log("Chegou aq");
      const [meal] = await db
        .insert(mealsTable)
        .values({
          userId,
          inputFileKey: "text",
          inputType: "text",
          status: "uploading",
          name: "",
          icon: "",
          foods: [],
        })
        .returning({
          id: mealsTable.id,
        });


      const command = new SendMessageCommand({
        QueueUrl: process.env.MEALS_QUEUE_URL,
        MessageBody: JSON.stringify({
          fileKey: "text",
          text: data.text,
          mealId: meal.id,
        }),
      });

      await sqsClient.send(command);

      return created({
        mealId: meal.id,
      });
    } catch (error) {
      console.log("🚀 ~ CreateMealController ~ handler ~ error:", error);
      return badRequest({
        error,
      });
    }
  }
}
