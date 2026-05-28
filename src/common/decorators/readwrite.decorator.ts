import { SetMetadata } from '@nestjs/common';
import { ServiceAccess } from '../enums/service-access.enum';

export const READ_WRITE_KEY = 'read_write';

export const ReadWrite = (access: ServiceAccess) =>
  SetMetadata(READ_WRITE_KEY, access);
