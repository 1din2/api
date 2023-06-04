import S3 from "aws-sdk/clients/s3";
import { ImageData, ImageProvider } from "../../domain/image/entity/image";
import {
  ImageStorage,
  ImageStorageSaveInput,
  ImageStorageSaveOutput,
} from "../../domain/image/service/image-storage";
import logger from "../../domain/logger";

export type S3ImageStorageConfig = {
  bucket: string;
};

const ext = (contentType: string) => {
  const ext = contentType.toLowerCase().split("/")[1];
  if (!ext) throw new Error(`Invalid image content type ${contentType}`);
  return ext;
};

const formatKey = (
  id: string,
  contentType: string,
  date = new Date().getTime()
) => {
  const prefix = new Date(date).toISOString().substring(0, 7);
  return `${prefix}/images/${id}.${ext(contentType)}`;
};

export class S3ImageStorage implements ImageStorage {
  constructor(private s3: S3, private config: S3ImageStorageConfig) {}

  async delete({
    hash,
    id,
    contentType,
    createdAt,
  }: ImageData): Promise<boolean> {
    const Key = formatKey(hash, contentType, createdAt);

    try {
      await this.s3
        .deleteObject({
          Bucket: this.config.bucket,
          Key: Key,
        })
        .promise();
      return true;
    } catch (e) {
      logger.error(`Error on deleting S3 image`, id, e);
      return false;
    }
  }

  async save({
    streamBuffer,
    contentType,
    id,
  }: ImageStorageSaveInput): Promise<ImageStorageSaveOutput> {
    const Key = formatKey(id, contentType);

    const { Location } = await this.s3
      .upload({
        Bucket: this.config.bucket,
        ACL: "public-read",
        Key,
        Body: streamBuffer,
        CacheControl: "public, max-age=" + 86400 * 30,
        ContentType: contentType,
      })
      .promise();

    return {
      provider: ImageProvider.S3,
      url: Location,
    };
  }
}
