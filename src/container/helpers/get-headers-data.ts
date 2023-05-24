import { Request } from "express";
import getCurrentLanguage from "./get-current-language";
import { ApiUserData } from "../types";
import { isAuthorized } from "../authorization";
// import configuration from "../configuration";

export default (req: Request): ApiUserData => {
  const language = getCurrentLanguage(req);
  const isAuthenticated = isAuthorized(req);
  const project = (req.headers["x-project"] || req.query.project) as string;

  // if (!configuration.projects.includes(project))
    // throw new Error("Project header is invalid");

  return { language, isAuthenticated, project };
};
