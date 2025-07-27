import { ok } from "../utils/http";
import { HttpRequest, HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export class MeController {
  static async handler({
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await db.query.usersTable.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        calories: true,
        carbohydrates: true,
        proteins: true,
        fats: true,
      },
      where: eq(usersTable.id, userId),
    });

    return ok({
      user,
    });
  }
}
