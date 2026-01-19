import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditedEntity } from 'src/utils/AuditedEntity.class';
import { requestContext } from 'src/RequestContext/RequestContext';

@EventSubscriber()
export class AuditSubscriber
  implements EntitySubscriberInterface<AuditedEntity>
{
  beforeInsert(event: InsertEvent<AuditedEntity>) {
    const ctx = requestContext.getStore();
    console.log('Context:', ctx);
    if (!ctx?.userId) return;

    event.entity.createdBy = ctx.userId;
  }

  beforeUpdate(event: UpdateEvent<AuditedEntity>) {
    const ctx = requestContext.getStore();
    if (!ctx?.userId) return;

    if (event.entity) {
      event.entity.updatedById = ctx.userId;
    }
  }
}
