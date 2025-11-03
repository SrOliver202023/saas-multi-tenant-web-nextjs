import { IRepository } from "@/backend/core/types";
import { ExternalAuth } from "../entities";
import { IExternalAuthProviderEnumType } from "../enums";

export abstract class IExternalAuthRepository extends IRepository<ExternalAuth> {
  public abstract findById(externalAuthId: string): Promise<ExternalAuth | null>;
  public abstract findByExternalId(providerUserId: string, provider: IExternalAuthProviderEnumType): Promise<ExternalAuth | null>;
}
