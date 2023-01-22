import { join } from "path";
import { createWriteStream, unlink, writeFile } from "fs";
import { promisify } from "util";
import { ImageData, ImageProvider } from "../../domain/image/entity/image";
import {
  ImageStorage,
  ImageStorageSaveInput,
  ImageStorageSaveOutput,
} from "../../domain/image/service/image-storage";
import logger from "../../domain/logger";

const unlinkPromise = promisify(unlink);

export class LocalImageStorage implements ImageStorage {
  constructor(private dir: string) {}

  async delete({ id, contentType }: ImageData): Promise<boolean> {
    const key = `${id}.${contentType.split("/")[1]}`;

    const location = join(this.dir, key);
    try {
      await unlinkPromise(location);
      return true;
    } catch (e) {
      logger.error(`Error on deleteting image from fs`, location, e);
      return false;
    }
  }

  async save({
    streamBuffer,
    contentType,
    id,
  }: ImageStorageSaveInput): Promise<ImageStorageSaveOutput> {
    const key = `${id}.${contentType.split("/")[1]}`;

    const location = join(this.dir, key);
    const result = { provider: ImageProvider.S3, url: location };

    if (Buffer.isBuffer(streamBuffer)) {
      return new Promise((resolve, reject) => {
        writeFile(location, streamBuffer, (error) => {
          if (error) return reject(error);
          return resolve(result);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        streamBuffer
          .pipe(createWriteStream(location))
          .on("error", reject)
          .on("finish", () => resolve(result));
      });
    }
  }
}
