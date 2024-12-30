import { ProducerDocumentType } from '@app/domain/producer/Producer';
import { UseCase } from '@app/shared/types/UseCase';
import { ProducerMapper } from '@app/application/mappers/producer/ProducerMapper';

export type Input = {
  name: string;
  document: string;
  documentType: ProducerDocumentType;
};

export type Output = ReturnType<typeof ProducerMapper.toDTO>;

export interface ICreateProducerUseCase extends UseCase<Input, Output> {}

export const ICreateProducerUseCase = Symbol('ICreateProducerUseCase');
