import { Request } from "express";
import getLanguageFromRequestHeader from "./get-language-from-request-header";

export default (req?: Request) =>
  req
    ? getLanguageFromRequestHeader(req.headers["accept-language"]) || "en"
    : "en";
