import { EntityId } from "../../domain/base/entity";
import { JsonValidator } from "../../domain/base/validator";
import { Image, ImageCreateData, ImageData } from "../../domain/image/entity/image";
import {
  ImageHashUniqueKey,
  ImageService,
} from "../../domain/image/service/image-service";
import { DbRepository } from "../db/repository";

export class ImageDbService
  extends DbRepository<ImageData>
  implements ImageService
{
  constructor() {
    super("Image", {
      createValidator: new JsonValidator(Image.jsonSchema),
      updateValidator: new JsonValidator({
        ...Image.jsonSchema,
        required: ["id"],
      }),
    });
  }

  async deleteByUserId(userId: EntityId): Promise<number> {
    const all = await this.query.where({ userId }).delete().returning("*");
    await Promise.all(all.map((it) => this.onDeleted(it)));
    return all.length;
  }

  async findUniqueByHash({
    hash,
    height,
    width,
  }: ImageHashUniqueKey): Promise<ImageData | null> {
    const item = await this.query.where({ hash, height, width }).first();
    return item || null;
  }

  override async findUnique(data: ImageCreateData): Promise<ImageData | null> {
    const item = await this.findUniqueByHash(data);
    if (item) return item;

    return super.findUnique(data);
  }
}
