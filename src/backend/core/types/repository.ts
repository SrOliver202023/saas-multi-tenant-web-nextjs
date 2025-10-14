export abstract class IRepository<Entity> {
  public abstract create(entity: Entity): Promise<Entity>
  public abstract update(entity: Entity): Promise<Entity>
  public abstract delete(entity: Entity): Promise<Entity>
}
