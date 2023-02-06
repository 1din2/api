import { createApiContext } from "../../../container/api-context";
import configuration from "../../../container/configuration";
import logger from "../../../domain/logger";
import { IdentityProvider } from "../../../domain/user/entity/identity";
import { UserRole } from "../../../domain/user/entity/user";

export async function seed() {
  if (!configuration.admin_email) {
    logger.warn(`ADMIN_EMAIL not set`);
    return;
  }

  const context = await createApiContext();
  const identity = await context.services.identity.findByProviderId(
    IdentityProvider.GOOGLE,
    configuration.admin_email
  );

  const user = identity
    ? await context.services.user.findByIdentityId(identity.id)
    : null;

  if (!user) {
    logger.warn(`User with email=ADMIN_EMAIL not found`);
    return;
  }

  if (user.role === UserRole.ADMIN) return;

  await context.services.user.update({ id: user.id, role: UserRole.ADMIN });

  console.log(`Now ${user.identityId} is ADMIN!`);
}