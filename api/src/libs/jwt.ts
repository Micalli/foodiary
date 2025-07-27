import { JwtPayload, sign, verify } from "jsonwebtoken";
export function signAccessToken(userId: string): string {
  const accesstoken = sign(
    {
      sub: userId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "3d" }
  );
  return accesstoken;
}

export function validateAccessToken(token: string) {
  try {
    const { sub } = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return sub ?? null;
  } catch {
    return null;
  }
}
