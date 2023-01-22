import { Request } from "express";
import getCurrentLanguage from "./get-current-language";
import { ApiUserData } from "../types";
import { isAuthorized } from "../authorization";

export default (req: Request): ApiUserData => {
  const language = getCurrentLanguage(req);
  const isAuthenticated = isAuthorized(req);

  return { language, isAuthenticated };
};
