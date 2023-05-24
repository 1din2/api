import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { Image, ImageData } from "../entity/image";

export type ImageHashUniqueKey = {
  hash: string;
  height: number;
  width: number;
};

export interface ImageService extends Repository<ImageData, Image> {
  findUniqueByHash(key: ImageHashUniqueKey): Promise<Image | null>;
  deleteByUserId(userId: EntityId): Promise<number>;
}
