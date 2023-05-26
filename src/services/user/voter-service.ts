import { Voter, VoterData } from "../../domain/user/entity/voter";
import {
  FindVoterParams,
  VoterService,
} from "../../domain/user/service/voter-service";
import { DbRepository } from "../db/repository";

export class VoterDbService
  extends DbRepository<VoterData, Voter>
  implements VoterService
{
  constructor() {
    super(Voter);
  }

  override toEntity(data: VoterData): Voter {
    return new Voter(data);
  }

  async find({
    offset,
    limit,
    fromUpdatedAt,
    ip,
    userId,
  }: FindVoterParams): Promise<Voter[]> {
    const query = this.query()
      .offset(offset || 0)
      .limit(limit || 10);
    if (ip) query.where({ ip });
    if (userId) query.where({ userId });
    if (fromUpdatedAt) query.where("updatedAt", ">", fromUpdatedAt);
    const items = await query.orderBy("updatedAt", "desc");
    return this.toEntities(items);
  }
}
