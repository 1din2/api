import {
  Voter,
  VoterCreateData,
  VoterData,
} from "../../domain/user/entity/voter";
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

  async findByUId(uid: string): Promise<Voter | null> {
    const item = await this.query().where({ uid }).first();
    return item ? this.toEntity(item) : null;
  }

  async find({
    offset,
    limit,
    fromUpdatedAt,
    ip,
    userId,
    uid,
  }: FindVoterParams): Promise<Voter[]> {
    const query = this.query()
      .offset(offset || 0)
      .limit(limit || 10);
    if (ip) query.where({ ip });
    if (userId) query.where({ userId });
    if (uid) query.where({ uid });
    if (fromUpdatedAt) query.where("updatedAt", ">", fromUpdatedAt);
    const items = await query.orderBy("updatedAt", "desc");
    return this.toEntities(items);
  }

  override async findUnique(data: VoterCreateData): Promise<Voter | null> {
    const user = await this.findByUId(data.uid);
    if (user) return user;

    return super.findUnique(data);
  }
}
