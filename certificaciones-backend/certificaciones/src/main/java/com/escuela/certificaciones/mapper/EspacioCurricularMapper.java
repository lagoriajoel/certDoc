package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.EspacioCurricularDTO;
import com.escuela.certificaciones.entity.EspacioCurricular;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EspacioCurricularMapper {

    EspacioCurricularDTO toDTO(EspacioCurricular entity);

    @Mapping(target = "movimientos", ignore = true)
    EspacioCurricular toEntity(EspacioCurricularDTO dto);

    @Mapping(target = "movimientos", ignore = true)
    void updateFromDTO(EspacioCurricularDTO dto, @MappingTarget EspacioCurricular entity);
}
