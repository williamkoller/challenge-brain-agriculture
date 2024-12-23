import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateProducerUseCase } from '../../../application/usecases/producer/CreateProducer/CreateProducerUseCase';
import { ICreateProducerUseCase } from '../../../application/usecases/producer/CreateProducer/ICreateProducerUseCase';
import { ProducerModel } from '../../../infrastructure/database/models/ProducerModel';
import { ProducerController } from '../../controllers/producer/producer.controller';
import { ProducerRepositoryImplementation } from '../../../infrastructure/repositories/producer/ProducerRepositoryImplementation';
import { IGetProducersUseCase } from '../../../application/usecases/producer/GetProducers/IGetProducersUseCase';
import { GetProducersUseCase } from '../../../application/usecases/producer/GetProducers/GetProducersUseCase';
import { IUpdateProducerUseCase } from '../../../application/usecases/producer/UpdateProducer/IUpdateProducerUseCase';
import { UpdateProducerUseCase } from '../../../application/usecases/producer/UpdateProducer/UpdateProducerUseCase';
import { IDeleteProducerUseCase } from '../../../application/usecases/producer/DeleteProducer/IDeleteProducerUseCase';
import { DeleteProducerUseCase } from '../../../application/usecases/producer/DeleteProducer/DeleteProducerUseCase';
import { ProducerRepository } from '../../../application/interfaces/producer/ProducerRepository';

@Module({
  imports: [SequelizeModule.forFeature([ProducerModel])],
  controllers: [ProducerController],
  providers: [
    {
      provide: ProducerRepository,
      useClass: ProducerRepositoryImplementation,
    },
    {
      provide: ICreateProducerUseCase,
      useClass: CreateProducerUseCase,
    },
    {
      provide: IGetProducersUseCase,
      useClass: GetProducersUseCase,
    },
    {
      provide: IUpdateProducerUseCase,
      useClass: UpdateProducerUseCase,
    },
    {
      provide: IDeleteProducerUseCase,
      useClass: DeleteProducerUseCase,
    },
  ],
  exports: [ProducerRepository],
})
export class ProducerModule {}
