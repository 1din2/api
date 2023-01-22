import { ReadStream } from "fs";
import { ImageProvider, ImageData } from "../entity/image";

export type ImageStorageSaveInput = {
  streamBuffer: ReadStream | Buffer;
  // key: string;
  contentType: string;
  id: string;
};

export type ImageStorageSaveOutput = {
  url: string;
  provider: ImageProvider;
};

export interface ImageStorage {
  save(input: ImageStorageSaveInput): Promise<ImageStorageSaveOutput>;
  delete(image: ImageData): Promise<boolean>;
}
