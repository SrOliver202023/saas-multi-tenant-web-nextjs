// import { Workspace } from "@/backend/domain/entities";
// import { Workspace as WorkspacePrisma, Prisma } from "@prisma/client";

// export class WorkspacePrismaMapper {
//   public static toPrisma(raw: Workspace): Prisma.WorkspaceUncheckedCreateInput {
//     return {
//       workspaceId: raw.workspaceId,
//       accountId: raw.accountId,
//       workspaceName: raw.workspaceName,
//       workspaceDescription: raw.workspaceDescription,
//       createdAt: raw.createdAt,
//       deletedAt: raw.deletedAt,
//     }
//   }

//   public static toDomain(raw: WorkspacePrisma): Workspace {
//     return Workspace.create({
//       accountId: raw.accountId,
//       workspaceName: raw.workspaceName,
//       deletedAt: raw?.deletedAt ?? undefined,
//       workspaceDescription: raw?.workspaceDescription ?? undefined,
//       createdAt: raw.createdAt,
//     }, raw.workspaceId)
//   }
// }
