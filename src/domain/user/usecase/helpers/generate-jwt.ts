import jwt, { SignOptions } from "jsonwebtoken";
import { EntityId } from "../../../base/entity";
import { ValidationError } from "../../../base/errors";

export default function generateJWT(userId: EntityId): Promise<string> {
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;
    const issuer = process.env.JWT_ISSUER;

    if (!secret) {
      reject(new ValidationError("No JWT_SECRET found."));
      return;
    }

    const options: SignOptions = {
      subject: `${userId}`,
      // expiresIn: "14 days",
    };

    if (issuer) {
      options.issuer = issuer;
    }

    jwt.sign({}, secret, options, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token || "");
    });
  });
}
