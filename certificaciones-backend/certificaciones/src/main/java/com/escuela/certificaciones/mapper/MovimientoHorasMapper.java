package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.MovimientoHorasDTO;
import com.escuela.certificaciones.entity.MovimientoHoras;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovimientoHorasMapper {

    @Mapping(source = "docente.id",                     target = "docenteId")
    @Mapping(source = "espacioCurricular.id",           target = "espacioCurricularId")
    @Mapping(source = "espacioCurricular.nombre",       target = "espacioCurricularNombre")
    @Mapping(source = "cargo.id",                       target = "cargoId")
    @Mapping(source = "cargo.nombre",                   target = "cargoNombre")
    @Mapping(source = "cargo.requiereCurso",            target = "cargoRequiereCurso")
    @Mapping(source = "situacionRevista.id",            target = "situacionRevistaId")
    @Mapping(source = "situacionRevista.nombre",        target = "situacionRevistaNombre")
    MovimientoHorasDTO toDTO(MovimientoHoras entity);

    @Mapping(target = "id",               ignore = true)
    @Mapping(target = "docente",          ignore = true)
    @Mapping(target = "espacioCurricular",ignore = true)
    @Mapping(target = "cargo",            ignore = true)
    @Mapping(target = "situacionRevista", ignore = true)
    @Mapping(target = "acta",             ignore = true)
    @Mapping(target = "tipo",             ignore = true)
    MovimientoHoras toEntity(MovimientoHorasDTO dto);

    @Mapping(target = "docente",          ignore = true)
    @Mapping(target = "espacioCurricular",ignore = true)
    @Mapping(target = "cargo",            ignore = true)
    @Mapping(target = "situacionRevista", ignore = true)
    @Mapping(target = "acta",             ignore = true)
    @Mapping(target = "tipo",             ignore = true)
    void updateFromDTO(MovimientoHorasDTO dto, @MappingTarget MovimientoHoras entity);
}