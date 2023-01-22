export interface ImageMetadataInfo {
  width: number;
  height: number;
  hash: string;
  length: number;
}

export interface ImageMetadataService {
  getInfo(input: Buffer): Promise<ImageMetadataInfo>;
}
