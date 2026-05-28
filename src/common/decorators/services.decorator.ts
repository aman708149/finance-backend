import { SetMetadata } from '@nestjs/common';

export const SERVICES_KEY = 'services';

export const AllowedServices = (...services: string[]) =>
  SetMetadata(SERVICES_KEY, services);
