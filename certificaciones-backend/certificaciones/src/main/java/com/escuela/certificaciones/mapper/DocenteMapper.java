package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.DocenteDTO;
import com.escuela.certificaciones.entity.Docente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DocenteMapper {

    DocenteDTO toDTO(Docente docente);

    @Mapping(target = "movimientos", ignore = true)
    Docente toEntity(DocenteDTO dto);

    @Mapping(target = "movimientos", ignore = true)
    void updateFromDTO(DocenteDTO dto, @MappingTarget Docente docente);
}
