import yaml from "js-yaml";
import { readFileSync } from "fs";

export const readYaml = <T>(file: string): T =>
  yaml.load(readFileSync(file, "utf8")) as T;
