import { IRepository } from "@/backend/core/types";
import { Workspace } from "../entities";

export abstract class IWorkspaceRepository extends IRepository<Workspace> {
  public abstract findById(accountId: string): Promise<Workspace | null>
}