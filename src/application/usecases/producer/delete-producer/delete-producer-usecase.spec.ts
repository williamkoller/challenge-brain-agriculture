import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Producer, ProducerDocumentType } from '@app/domain/producer/producer';
import { CPF } from '@app/shared/domain/cpf';
import { ProducerNotFoundException } from '@app/application/exceptions/producer/producer-not-found-exception';
import { ProducerRepository } from '@app/application/interfaces/producer/producer-repository';
import { DeleteProducerUseCase } from './delete-producer-usecase';
import { UniqueEntityId } from '@app/shared/domain/unique-entity-id';

jest.mock('sequelize-transactional-decorator', () => ({
  Transactional: () => () => ({}),
}));

describe('DeleteProducerUseCase', () => {
  let deleteProducerUseCase: DeleteProducerUseCase;
  let producerRepository: ProducerRepository;

  const mockProducerRepository = {
    findById: jest.fn(),
    remove: jest.fn(),
  };

  const mockProducer = Producer.create(
    {
      name: 'Producer Name',
      document: CPF.create({ number: '18007708049' }),
      documentType: ProducerDocumentType.CPF,
    },
    new UniqueEntityId('1'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProducerUseCase,
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    deleteProducerUseCase = module.get<DeleteProducerUseCase>(
      DeleteProducerUseCase,
    );
    producerRepository = module.get<ProducerRepository>(ProducerRepository);
  });

  it('should be defined', () => {
    expect(deleteProducerUseCase).toBeDefined();
  });

  it('should throw ProducerNotFoundException when producer is not found', async () => {
    mockProducerRepository.findById.mockResolvedValue(null);

    await expect(
      deleteProducerUseCase.execute({ producerId: '1' }),
    ).rejects.toThrow(ProducerNotFoundException);
  });

  it('should delete producer successfully', async () => {
    mockProducerRepository.findById.mockResolvedValue(mockProducer);
    mockProducerRepository.remove.mockResolvedValue(void 0);

    await expect(
      deleteProducerUseCase.execute({ producerId: '1' }),
    ).resolves.not.toThrow();
    expect(mockProducerRepository.remove).toHaveBeenCalledWith(
      mockProducer.id.toString(),
    );
  });

  it('should throw BadRequestException if an error occurs during deletion', async () => {
    mockProducerRepository.findById.mockResolvedValue(mockProducer);
    mockProducerRepository.remove.mockRejectedValue(new Error('Some error'));

    await expect(
      deleteProducerUseCase.execute({ producerId: '1' }),
    ).rejects.toThrowError(BadRequestException);
  });
});
