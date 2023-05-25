import { Profile } from "passport";
import { BaseUseCase, DomainContext } from "../../base/usecase";
import { User, UserRole } from "../entity/user";
import { UserService } from "../service/user-service";
import { AccountService } from "../service/account-service";
import { Account } from "../entity/account";
import { InvalidInputError } from "../../base/errors";

export interface ProviderLoginInput {
  // accessToken: string;
  profile: Profile;
  // ip: string;
  // localUserId: string;
}

export class ProviderLoginUseCase extends BaseUseCase<
  ProviderLoginInput,
  User
> {
  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {
    super();
  }

  protected override async innerExecute(
    { profile }: ProviderLoginInput,
    { project }: DomainContext
  ): Promise<User> {
    if (!project) throw new InvalidInputError("Project is required");

    const provider = Account.toProvider(profile.provider);
    const providerId = profile.id;

    let existingAccount = await this.accountService.findByProviderId(
      provider,
      providerId
    );
    if (existingAccount)
      return this.userService.checkById(existingAccount.userId);

    const email = profile.emails?.[0].value.trim().toLowerCase();
    let existingUser: User | null = null;
    if (email) existingUser = await this.userService.findByEmail(email);

    return this.accountService.transaction<User>(async (trx) => {
      if (!existingUser)
        existingUser = await this.userService.create(
          {
            id: User.createId(),
            email,
            displayName: profile.displayName,
            givenName: profile.name?.givenName,
            familyName: profile.name?.familyName,
            role: UserRole.USER,
            uid: `${provider}:${providerId}`,
            project,
          },
          trx
        );

      existingAccount = await this.accountService.create(
        {
          id: Account.createId(),
          userId: existingUser.id,
          provider,
          providerId,
          displayName: profile.displayName,
          givenName: profile.name?.givenName,
          familyName: profile.name?.familyName,
          emails: profile.emails?.map((email) =>
            email.value.trim().toLowerCase()
          ),
          photos: profile.photos?.map((photo) => photo.value),
          profile: profile as never,
        },
        trx
      );

      return existingUser;
    });
  }
}
