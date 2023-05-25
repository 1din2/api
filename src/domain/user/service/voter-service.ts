import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { Voter, VoterData } from "../entity/voter";

export type FindVoterParams = {
  ip?: string;
  userId?: EntityId;
  limit?: number;
  offset?: number;
  fromUpdatedAt?: number;
};

export interface VoterService extends Repository<VoterData, Voter> {
  find(params: FindVoterParams): Promise<Voter[]>;
}
