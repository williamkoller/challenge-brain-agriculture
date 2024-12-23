import { UseCase } from '../../../../shared/types/UseCase';

export type Input = {
  producerId: string;
};

export interface IDeleteProducerUseCase extends UseCase<Input, void> {}

export const IDeleteProducerUseCase = Symbol('IDeleteProducerUseCase');
