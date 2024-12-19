import { Module } from '@nestjs/common';
import { HealthCheckController } from '@app/shared/http/controllers/health-check/health-check.controller';

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}