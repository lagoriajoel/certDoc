package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.SituacionRevistaDTO;
import com.escuela.certificaciones.entity.SituacionRevista;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SituacionRevistaMapper {

    SituacionRevistaDTO toDTO(SituacionRevista entity);

    @Mapping(target = "movimientos", ignore = true)
    SituacionRevista toEntity(SituacionRevistaDTO dto);

    @Mapping(target = "movimientos", ignore = true)
    void updateFromDTO(SituacionRevistaDTO dto, @MappingTarget SituacionRevista entity);
}
