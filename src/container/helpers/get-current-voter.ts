import { Request } from "express";
import { VoterService } from "../../domain/user/service/voter-service";
import { Voter } from "../../domain/user/entity/voter";

export default async (req: Request, voterService: VoterService) => {
  const uid = req.headers["x-uid"] as string;
  if (!uid) return null;

  return voterService.findOrCreate({
    id: Voter.createId(),
    uid,
    userAgent: req.headers["user-agent"] as string,
    ip: req.ip,
  });
};
