import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Producer, ProducerDocumentType } from '@app/domain/producer/producer';
import { CNPJ } from '@app/shared/domain/cnpj';
import { CPF } from '@app/shared/domain/cpf';
import { ProducerNotFoundException } from '@app/application/exceptions/producer/producer-not-found-exception';
import { ProducerRepository } from '@app/application/interfaces/producer/producer-repository';
import { ProducerMapper } from '@app/application/mappers/producer/producer-mapper';
import { UpdateProducerUseCase } from './update-producer-usecase';
import { UniqueEntityId } from '@app/shared/domain/unique-entity-id';

jest.mock('sequelize-transactional-decorator', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateProducerUseCase', () => {
  let updateProducerUseCase: UpdateProducerUseCase;
  let producerRepository: ProducerRepository;

  const mockProducerRepository = {
    findById: jest.fn(),
    update: jest.fn(),
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
        UpdateProducerUseCase,
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    updateProducerUseCase = module.get<UpdateProducerUseCase>(
      UpdateProducerUseCase,
    );
    producerRepository = module.get<ProducerRepository>(ProducerRepository);
  });

  it('should be defined', () => {
    expect(updateProducerUseCase).toBeDefined();
  });

  it('should throw ProducerNotFoundException when producer is not found', async () => {
    mockProducerRepository.findById.mockResolvedValue(null);

    await expect(
      updateProducerUseCase.execute({
        producerId: '1',
        name: 'New Name',
        document: '18007708049',
        documentType: ProducerDocumentType.CPF,
      }),
    ).rejects.toThrow(ProducerNotFoundException);
  });

  it('should update producer successfully', async () => {
    mockProducerRepository.findById.mockResolvedValue(mockProducer);
    jest.spyOn(mockProducer, 'toUpdate').mockReturnValue(mockProducer);
    mockProducerRepository.update.mockResolvedValue(mockProducer);

    const result = await updateProducerUseCase.execute({
      producerId: '1',
      name: 'Updated Name',
      document: '98765432100',
      documentType: ProducerDocumentType.CNPJ,
    });

    expect(result).toEqual(ProducerMapper.toDTO(mockProducer));
    expect(mockProducer.toUpdate).toHaveBeenCalledWith({
      name: 'Updated Name',
      document: CNPJ.create('98765432100'),
      documentType: ProducerDocumentType.CNPJ,
    });
    expect(mockProducerRepository.update).toHaveBeenCalledWith(mockProducer);
  });

  it('should throw BadRequestException if an error occurs during update', async () => {
    mockProducerRepository.findById.mockResolvedValue(mockProducer);
    mockProducerRepository.update.mockRejectedValue(new Error('Some error'));

    await expect(
      updateProducerUseCase.execute({
        producerId: '1',
        name: 'New Name',
        document: '18007708049',
        documentType: ProducerDocumentType.CPF,
      }),
    ).rejects.toThrowError(BadRequestException);
  });
});
