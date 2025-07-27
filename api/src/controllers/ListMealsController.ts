import { badRequest, ok } from "../utils/http";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import z from "zod";

const schema = z.object({
  date: z.iso.date().transform((dateStr) => new Date(dateStr)),
});

export class ListMealsController {
  static async handler({
    userId,
    queryParams,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(queryParams);

    if (!success) {
      return badRequest({ errors: error.issues });
    }
    const endDate = new Date(data.date);
    endDate.setUTCHours(23, 59, 59, 999);

    const meals = await db.query.mealsTable.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: and(
        eq(mealsTable.userId, userId),
        gte(mealsTable.createdAt, data.date),
        lte(mealsTable.createdAt, endDate),
        eq(mealsTable.status, "success")
      ),
      orderBy: [desc(mealsTable.createdAt)], // <-- aqui
    });
    return ok({ meals });
  }
}
