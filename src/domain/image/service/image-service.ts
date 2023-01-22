import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { ImageData } from "../entity/image";

export type ImageHashUniqueKey = {
  hash: string;
  height: number;
  width: number;
};

export interface ImageService extends Repository<ImageData> {
  findUniqueByHash(key: ImageHashUniqueKey): Promise<ImageData | null>;
  deleteByUserId(userId: EntityId): Promise<number>;
}
