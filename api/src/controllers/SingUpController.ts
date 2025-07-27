import z from "zod";
import { badRequest, conflict, created } from "../utils/http";
import { HttpRequest, HttpResponse } from "../types/Http";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signAccessToken } from "../libs/jwt";
import { calculateGoals } from "../libs/goalCalculator";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
  }),
});
export class SingUpController {
  static async handler(req: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(req.body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.account.email),
    });

    if (userAlreadyExists) {
      return conflict({
        error: "This email is already registered.",
      });
    }
    const { account, ...rest } = data;

    const goals = calculateGoals({
      activityLevel: rest.activityLevel,
      gender: rest.gender,
      birthDate: new Date(rest.birthDate),
      height: rest.height,
      weight: rest.weight,
      goal: rest.goal,
    });
    const hashedPassword = await hash(account.password, 10);

    const [user] = await db
      .insert(usersTable)
      .values({
        ...account,
        ...rest,
        ...goals,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
      });

    const accesstoken = signAccessToken(user.id);

    return created({
      accesstoken,
    });
  }
}
