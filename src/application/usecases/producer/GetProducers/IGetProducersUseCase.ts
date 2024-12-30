import { UseCase } from '@app/shared/types/UseCase';
import { ProducerMapper } from '@app/application/mappers/producer/ProducerMapper';

export type Output = ReturnType<typeof ProducerMapper.toDTO>;

export interface IGetProducersUseCase extends UseCase<void, Output[]> {}

export const IGetProducersUseCase = Symbol('IGetProducersUseCase');
