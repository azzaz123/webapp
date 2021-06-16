export type ToApiMapper<DomainType, ApiType> = (input: DomainType) => ApiType;
