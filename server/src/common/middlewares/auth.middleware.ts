import { Request, Response, NextFunction } from "express";
import { auth } from "@/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (sessionResponse) {
      req.user = sessionResponse.user;
      req.session = sessionResponse.session;
    }
    next();
  } catch (error) {
    next(error);
  }
}
