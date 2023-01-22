import { ReadStream } from "fs";

export default (stream: ReadStream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf: Uint8Array[] = [];

    stream.on("data", (chunk) => _buf.push(chunk as never));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
};
