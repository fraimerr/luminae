import prisma from "@luminae/db";
import crypto from "crypto";
import { decode, sign, verify } from "hono/jwt";
import { env } from "../env";

export class SessionManager {
  public async create(userId: string): Promise<string> {
    const sessionToken = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60 * 60 * 24 * 14);

    const session = await prisma.sessions.create({
      data: {
        userId,
        token: sessionToken,
        expiresAt,
      },
    });

    if (!session) {
      throw new Error("Failed to create session");
    }

    const token = sign(
      {
        userId,
        sessionId: session.id,
        exp: Math.floor(expiresAt.getTime() / 1000),
      },
      env.JWT_SECRET,
    );

    return token;
  }

  public async validate(token: string) {
    try {
      const decoded = await verify(token, env.JWT_SECRET);

      const session = await prisma.sessions.findUnique({
        where: { id: decoded.sessionId as string },
        include: { user: true },
      });

      if (!session) {
        throw new Error("Session not found");
      }

      if (decoded.exp! < new Date().getTime() / 1000) {
        throw new Error("Session has expired");
      }

      if (new Date() > session.expiresAt) {
        await prisma.sessions.delete({ where: { id: session.id } });
        throw new Error("Session has expired");
      }

      return decoded;
    } catch (err) {
      console.error(err);
    }
  }
}
