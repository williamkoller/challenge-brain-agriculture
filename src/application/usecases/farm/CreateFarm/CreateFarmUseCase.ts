import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICreateFarmUseCase, Input, Output } from './ICreateFarmUseCase';
import { ProducerRepository } from '../../../interfaces/producer/ProducerRepository';
import { ProducerNotFoundException } from '../../../exceptions/producer/ProducerNotFoundException';
import { Farm } from '../../../../domain/farm/Farm';
import { FarmRepository } from '../../../interfaces/farm/FarmRepository';
import { FarmMapper } from '../../../mappers/FarmMapper';
import { Transactional } from 'sequelize-transactional-decorator';

@Injectable()
export class CreateFarmUseCase implements ICreateFarmUseCase {
  private readonly logger = new Logger(CreateFarmUseCase.name);
  constructor(
    @Inject(ProducerRepository)
    private readonly producerRepository: ProducerRepository,
    @Inject(FarmRepository)
    private readonly farmRepository: FarmRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const producer = await this.producerRepository.findById(input.producerId);

    if (!producer) throw new ProducerNotFoundException();

    const totalArea = Farm.calculateTotalArea(
      input.arableArea,
      input.vegetationArea,
    );

    const farm = Farm.create({
      producerId: producer.id.toString(),
      name: input.name,
      state: input.state,
      totalArea: totalArea,
      arableArea: input.arableArea,
      vegetationArea: input.vegetationArea,
    });

    const farmSaved = await this.farmRepository.save(farm);

    return FarmMapper.toDTO(farmSaved);
  }
}
