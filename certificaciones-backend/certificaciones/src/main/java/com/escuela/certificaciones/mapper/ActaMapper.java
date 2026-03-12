package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.ActaDTO;
import com.escuela.certificaciones.entity.Acta;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ActaMapper {

    @Mapping(source = "movimiento.id", target = "movimientoId")
    @Mapping(expression = "java(entity.getMovimiento().getDocente().getApellido() + \", \" + entity.getMovimiento().getDocente().getNombre())", target = "docenteNombre")
    @Mapping(source = "movimiento.docente.dni", target = "docenteDni")
    @Mapping(source = "movimiento.espacioCurricular.nombre", target = "espacioCurricular")
    @Mapping(source = "movimiento.cantidadHoras", target = "cantidadHoras")
    @Mapping(source = "movimiento.curso", target = "curso")
    @Mapping(source = "movimiento.division", target = "division")
    @Mapping(source = "movimiento.situacionRevista.nombre", target = "situacionRevista")
    @Mapping(source = "movimiento.instrumentoLegalAlta", target = "instrumentoLegalAlta")
    @Mapping(source = "movimiento.instrumentoLegalBaja", target = "instrumentoLegalBaja")
    ActaDTO toDTO(Acta entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movimiento", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "fechaActualizacion", ignore = true)
    Acta toEntity(ActaDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movimiento", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "fechaActualizacion", ignore = true)
    void updateFromDTO(ActaDTO dto, @MappingTarget Acta entity);
}