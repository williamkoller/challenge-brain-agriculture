import { Producer, ProducerDocumentType } from '../../domain/producer/Producer';
import { ProducerAttributes } from '../../infrastructure/database/models/ProducerModel';
import { CNPJ } from '../../shared/domain/CNPJ';
import { CPF } from '../../shared/domain/CPF';
import { UniqueEntityId } from '../../shared/domain/UniqueEntityId';
import { Mapper } from '../../shared/types/Mapper';
import { FarmMapper } from './FarmMapper';

export class ProducerMapper extends Mapper<Producer, ProducerAttributes>() {
  static toPersistence(domain: Producer): ProducerAttributes {
    return {
      id: domain.id.toString(),
      name: domain.name,
      document:
        domain.document instanceof CPF
          ? domain.document.props.number
          : (domain.document as CNPJ).props.number,
      documentType: domain.documentType,
    };
  }

  static toDomain(raw: ProducerAttributes): Producer {
    return Producer.create(
      {
        name: raw.name,
        document:
          raw.documentType === ProducerDocumentType.CPF
            ? CPF.create({ number: raw.document })
            : CNPJ.create(raw.document),
        documentType: raw.documentType,
        farms: raw.farms ? raw.farms.map(FarmMapper.toDomain) : [],
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toDTO(domain: Producer) {
    return {
      id: domain.id.toString(),
      name: domain.name,
      document: domain.document.formatted,
      documentType: domain.documentType,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      farms: domain.farms.map(FarmMapper.toDTO),
    };
  }

  static toFarm(domain: Producer) {
    return {
      id: domain.id.toString(),
      name: domain.name,
      document: domain.document.formatted,
      documentType: domain.documentType,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
