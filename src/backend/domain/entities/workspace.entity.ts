import { Entity, UniqueEntityID, type IEntityProps } from "@/backend/core/entities";

export interface IWorkspaceProps extends IEntityProps {
  workspaceId: string;
  workspaceName: string;
  workspaceDescription: string | undefined;
  accountId: string;
  deletedAt: Date | undefined;
}

export class Workspace extends Entity<IWorkspaceProps> {
  get workspaceId(): string {
    return this.workspaceId;
  }

  set workspaceId(value: string) {
    this.props.workspaceId = value;
  }

  get workspaceName(): string {
    return this.props.workspaceName;
  }

  set workspaceName(value: string) {
    this.props.workspaceName = value;
  }

  get workspaceDescription(): string | undefined {
    return this.props.workspaceDescription;
  }

  set workspaceDescription(value: string) {
    this.props.workspaceDescription = value;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  set accountId(value: string) {
    this.props.accountId = value;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  set deletedAt(value: Date) {
    this.props.deletedAt = value;
  }

  public static create(props: Omit<IWorkspaceProps, "workspaceId">, workspaceId?: string) {
    return new Workspace({ ...props, workspaceId: new UniqueEntityID(workspaceId).toString() });
  }
}
