import { Repository } from "../../base/repository";
import { WebImageData, WebImage } from "../entity/web-image";

export type WebSearchImageParams = {
  query: string;
  minWidth?: number;
  minHeight?: number;
  limit?: number;
};

export type WebSearchImage = {
  url: string;
  width: number;
  height: number;
  hostname: string;
};

export type WebImageFindParams = {
  limit?: number;
  offset?: number;
  pollId?: string;
  pollOptionId?: string;
  urlHash?: string;
};

export interface WebImageService extends Repository<WebImageData, WebImage> {
  webSearch(params: WebSearchImageParams): Promise<WebSearchImage[]>;
  find(params: WebImageFindParams): Promise<WebImage[]>;
}
