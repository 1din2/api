import { Request, Response } from "express";
import getCurrentLanguage from "./get-current-language";
import { ApiUserData } from "../types";
import { isAuthorized } from "../authorization";
import configuration from "../configuration";

const IP_PROJECT = {} as Record<string, string>;

export const clearIpProject = (ip: string) => {
  delete IP_PROJECT[ip];
};

export default (req: Request, res: Response): ApiUserData => {
  const language = getCurrentLanguage(req);
  const isAuthenticated = isAuthorized(req);
  const project = (req.headers["x-project"] ||
    req.query.project ||
    res.req?.headers["x-project"] ||
    res.req?.query.project ||
    IP_PROJECT[req.ip]) as string;

  if (project && !configuration.projects.includes(project))
    throw new Error("Project header is invalid");

  if (project) IP_PROJECT[req.ip] = project;

  return { language, isAuthenticated, project };
};
