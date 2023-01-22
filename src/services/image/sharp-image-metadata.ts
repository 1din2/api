// import sharp from "sharp";
// import {
//   ImageMetadataInfo,
//   ImageMetadataService,
// } from "../../domain/image/service/image-metadata-service";
// import phash from "./phash";

// export class ShartImageMetadataService implements ImageMetadataService {
//   async getInfo(input: Buffer): Promise<ImageMetadataInfo> {
//     const buffer = input;
//     const data = await sharp(buffer).metadata();
//     const hash = await phash(buffer);

//     return {
//       hash,
//       height: data.height || 1,
//       width: data.width || 1,
//       length: data.size || 1,
//     };
//   }
// }
