import faker from "faker";
import {
  ImageCreateData,
  ImageProvider,
} from "../../domain/image/entity/image";

export const createImageData = (
  arg?: Partial<ImageCreateData>
): ImageCreateData => ({
  hash: faker.random.alphaNumeric(32),
  contentType: "image/png",
  provider: ImageProvider.S3,
  height: 120,
  width: 345,
  length: 10000,
  ...arg,
});
