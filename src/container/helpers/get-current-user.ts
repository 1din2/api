import { Request } from "express";
import JWT from "jsonwebtoken";
import { EntityId } from "../../domain/base/entity";
import logger from "../../domain/logger";
import { UserService } from "../../domain/user/service/user-service";
import configuration from "../configuration";
import { isPositiveNumber } from "../../domain/base/util";

export const getAuthToken = (req: Request): string | null => {
  const token = req.headers.authorization;

  return (token && token.replace(/^Bearer\s+/i, "")) || null;
};

const getUserIdFromToken = (token: string): EntityId | null => {
  const payload = JWT.verify(token, configuration.jwt_secret) as {
    sub: string;
  };
  if (payload && payload.sub) {
    const id = parseInt(payload.sub, 10);
    return isPositiveNumber(id) ? id : null;
  }

  return null;
};

export default async (req: Request, userService: UserService) => {
  const token = getAuthToken(req);
  if (!token) return null;
  let userId: EntityId | null = null;
  try {
    userId = getUserIdFromToken(token);
  } catch (error) {
    logger.error(error);
  }
  if (!userId) return null;

  return userService.findById(userId);
};
