import { ReadStream } from "fs";
import streamToBuffer from "../../../services/image/stream-to-buffer";
import { RequiredJSONSchema } from "../../base/json-schema";
import logger from "../../logger";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import { Image, ImageData } from "../entity/image";
import { ImageService } from "../service/image-service";
import { ImageMetadataService } from "../service/image-metadata-service";
import { ImageStorage } from "../service/image-storage";
import { UserRole } from "../../user/entity/user";

export interface UploadImageInput {
  filename: string;
  mimetype: string;
  encoding: string;
  stream: ReadStream;
}

export class UploadImageUseCase extends AuthUseCase<
  UploadImageInput,
  ImageData
> {
  constructor(
    private imageRep: ImageService,
    private metadataService: ImageMetadataService,
    private imageStorage: ImageStorage
  ) {
    super(UserRole.ADMIN);
  }

  protected async innerExecute(
    { stream, filename: originalName, mimetype: contentType }: UploadImageInput,
    { currentUser }: AuthDomainContext
  ): Promise<ImageData> {
    const buffer = await streamToBuffer(stream);
    const info = await this.metadataService.getInfo(buffer);
    let exists = await this.imageRep.findUniqueByHash(info);
    if (exists) {
      logger.info(`Found image duplication`, info);
      return exists;
    }

    exists = await this.imageRep.findUniqueByHash(info);
    if (exists) {
      logger.warn(`Found image duplication after upload`, info, exists.url);
      return exists;
    }

    const id = Image.createId();

    const { url, provider } = await this.imageStorage.save({
      streamBuffer: buffer,
      id,
      contentType,
    });

    return this.imageRep.create({
      id,
      ...info,
      contentType,
      originalName,
      provider,
      url,
      userId: currentUser.id,
    });
  }

  static override readonly jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      mimetype: { type: "string", pattern: "^image/(jpeg|png|webp)$" },
      filename: { type: "string", minLength: 5, maxLength: 100 },
      encoding: { type: "string" },
      stream: { type: "object" },
    },
    required: ["mimetype", "filename", "encoding", "stream"],
  };
}
