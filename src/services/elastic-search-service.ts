import { Client } from "@elastic/elasticsearch";
import SearchService from "../domain/service/search-service";

export class ElasticSearchService implements SearchService {
  protected client: Client;
  protected AD_PROTOTYPE_INDEX = "ad-prototype";
  protected AD_PROTOTYPE_TYPE = "prototype";

  protected TAG_INDEX = "tag";
  protected TAG_TYPE = "tag";

  constructor(protected _analyzer: string, node: string) {
    this.client = new Client({ node });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async init(): Promise<void> {}

  async reset(): Promise<void> {
    await this.init();
  }
}
