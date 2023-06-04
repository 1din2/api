import { WebImage, WebImageData } from "../../domain/image/entity/web-image";
import {
  WebImageFindParams,
  WebImageService,
  WebSearchImage,
  WebSearchImageParams,
} from "../../domain/image/service/web-image-service";
import { DbRepository } from "../db/repository";
import googleWebSearch from "./google-web-search";

export class WebImageDbService
  extends DbRepository<WebImageData, WebImage>
  implements WebImageService
{
  constructor() {
    super(WebImage);
  }

  async find({
    limit,
    offset,
    pollId,
    pollOptionId,
    urlHash,
  }: WebImageFindParams): Promise<WebImage[]> {
    const query = this.query()
      .limit(limit || 10)
      .offset(offset || 0);

    if (pollId) query.where("pollId", pollId);
    if (pollOptionId) query.where("pollOptionId", pollOptionId);
    if (urlHash) query.where("urlHash", urlHash);

    const items = await query.orderBy("id", "desc");

    return this.toEntities(items);
  }

  webSearch(params: WebSearchImageParams): Promise<WebSearchImage[]> {
    return googleWebSearch(params.query, {
      limit: params.limit || 2,
      minHeight: params.minHeight,
      minWidth: params.minWidth,
    });
  }
}
