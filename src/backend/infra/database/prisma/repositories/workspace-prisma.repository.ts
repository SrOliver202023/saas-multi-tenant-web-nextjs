// import { Workspace } from "@/backend/domain/entities";
// import { IWorkspaceRepository } from "@/backend/domain/repositories";
// import { PrismaClient } from "@prisma/client";
// import { WorkspacePrismaMapper } from "../mappers";

// export class WorkspacePrismaRepository implements IWorkspaceRepository {
//   constructor(private readonly prisma: PrismaClient) { }

//   public async findById(workspaceId: string): Promise<Workspace | null> {
//     const found = await this.prisma.workspace.findUnique({
//       where: {
//         workspaceId
//       }
//     })

//     if (!found) {
//       return null
//     }

//     return WorkspacePrismaMapper.toDomain(found)
//   }

//   public async create(entity: Workspace): Promise<Workspace> {
//     const created = await this.prisma.workspace.create({
//       data: WorkspacePrismaMapper.toPrisma(entity)
//     })
//     return WorkspacePrismaMapper.toDomain(created)
//   }

//   public async update(entity: Workspace): Promise<Workspace> {
//     const updated = await this.prisma.workspace.update({
//       where: {
//         workspaceId: entity.workspaceId
//       },
//       data: WorkspacePrismaMapper.toPrisma(entity)
//     })

//     return WorkspacePrismaMapper.toDomain(updated)
//   }

//   public async delete(entity: Workspace): Promise<Workspace> {
//     const deleted = await this.prisma.workspace.delete({
//       where: {
//         workspaceId: entity.workspaceId
//       }
//     })
//     return WorkspacePrismaMapper.toDomain(deleted)
//   }
// }
