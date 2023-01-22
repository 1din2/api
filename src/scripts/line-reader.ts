import { createInterface } from "readline";
import { createReadStream } from "fs";

export default (file: string) => {
  return createInterface(createReadStream(file, "utf8"));
};
