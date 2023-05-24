import { createApiContext } from "../../../container/api-context";
import configuration from "../../../container/configuration";
import logger from "../../../domain/logger";
import { AccountProvider } from "../../../domain/user/entity/account";
import { UserRole } from "../../../domain/user/entity/user";

export async function seed() {
  if (!configuration.admin_email) {
    logger.warn(`ADMIN_EMAIL not set`);
    return;
  }

  const context = await createApiContext();
  const account = await context.services.account.findByProviderId(
    AccountProvider.GOOGLE,
    configuration.admin_email
  );

  const user = account
    ? await context.services.user.findById(account.userId)
    : null;

  if (!user) {
    logger.warn(`User with email=ADMIN_EMAIL not found`);
    return;
  }

  if (user.role === UserRole.ADMIN) return;

  await context.services.user.update({ id: user.id, role: UserRole.ADMIN });

  console.log(`Now ${user.id} is ADMIN!`);
}
