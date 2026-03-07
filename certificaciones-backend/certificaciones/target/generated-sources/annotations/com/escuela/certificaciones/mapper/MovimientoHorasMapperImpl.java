package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.MovimientoHorasDTO;
import com.escuela.certificaciones.entity.Docente;
import com.escuela.certificaciones.entity.EspacioCurricular;
import com.escuela.certificaciones.entity.MovimientoHoras;
import com.escuela.certificaciones.entity.SituacionRevista;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-26T10:10:27-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17 (Oracle Corporation)"
)
@Component
public class MovimientoHorasMapperImpl implements MovimientoHorasMapper {

    @Override
    public MovimientoHorasDTO toDTO(MovimientoHoras entity) {
        if ( entity == null ) {
            return null;
        }

        MovimientoHorasDTO.MovimientoHorasDTOBuilder movimientoHorasDTO = MovimientoHorasDTO.builder();

        movimientoHorasDTO.docenteId( entityDocenteId( entity ) );
        movimientoHorasDTO.espacioCurricularId( entityEspacioCurricularId( entity ) );
        movimientoHorasDTO.espacioCurricularNombre( entityEspacioCurricularNombre( entity ) );
        movimientoHorasDTO.situacionRevistaId( entitySituacionRevistaId( entity ) );
        movimientoHorasDTO.situacionRevistaNombre( entitySituacionRevistaNombre( entity ) );
        movimientoHorasDTO.id( entity.getId() );
        movimientoHorasDTO.curso( entity.getCurso() );
        movimientoHorasDTO.division( entity.getDivision() );
        movimientoHorasDTO.modalidad( entity.getModalidad() );
        movimientoHorasDTO.cantidadHoras( entity.getCantidadHoras() );
        movimientoHorasDTO.fechaAlta( entity.getFechaAlta() );
        movimientoHorasDTO.instrumentoLegalAlta( entity.getInstrumentoLegalAlta() );
        movimientoHorasDTO.fechaBaja( entity.getFechaBaja() );
        movimientoHorasDTO.instrumentoLegalBaja( entity.getInstrumentoLegalBaja() );
        movimientoHorasDTO.observaciones( entity.getObservaciones() );

        return movimientoHorasDTO.build();
    }

    @Override
    public MovimientoHoras toEntity(MovimientoHorasDTO dto) {
        if ( dto == null ) {
            return null;
        }

        MovimientoHoras.MovimientoHorasBuilder movimientoHoras = MovimientoHoras.builder();

        movimientoHoras.id( dto.getId() );
        movimientoHoras.curso( dto.getCurso() );
        movimientoHoras.division( dto.getDivision() );
        movimientoHoras.modalidad( dto.getModalidad() );
        movimientoHoras.cantidadHoras( dto.getCantidadHoras() );
        movimientoHoras.fechaAlta( dto.getFechaAlta() );
        movimientoHoras.instrumentoLegalAlta( dto.getInstrumentoLegalAlta() );
        movimientoHoras.fechaBaja( dto.getFechaBaja() );
        movimientoHoras.instrumentoLegalBaja( dto.getInstrumentoLegalBaja() );
        movimientoHoras.observaciones( dto.getObservaciones() );

        return movimientoHoras.build();
    }

    @Override
    public void updateFromDTO(MovimientoHorasDTO dto, MovimientoHoras entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setCurso( dto.getCurso() );
        entity.setDivision( dto.getDivision() );
        entity.setModalidad( dto.getModalidad() );
        entity.setCantidadHoras( dto.getCantidadHoras() );
        entity.setFechaAlta( dto.getFechaAlta() );
        entity.setInstrumentoLegalAlta( dto.getInstrumentoLegalAlta() );
        entity.setFechaBaja( dto.getFechaBaja() );
        entity.setInstrumentoLegalBaja( dto.getInstrumentoLegalBaja() );
        entity.setObservaciones( dto.getObservaciones() );
    }

    private Long entityDocenteId(MovimientoHoras movimientoHoras) {
        if ( movimientoHoras == null ) {
            return null;
        }
        Docente docente = movimientoHoras.getDocente();
        if ( docente == null ) {
            return null;
        }
        Long id = docente.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long entityEspacioCurricularId(MovimientoHoras movimientoHoras) {
        if ( movimientoHoras == null ) {
            return null;
        }
        EspacioCurricular espacioCurricular = movimientoHoras.getEspacioCurricular();
        if ( espacioCurricular == null ) {
            return null;
        }
        Long id = espacioCurricular.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityEspacioCurricularNombre(MovimientoHoras movimientoHoras) {
        if ( movimientoHoras == null ) {
            return null;
        }
        EspacioCurricular espacioCurricular = movimientoHoras.getEspacioCurricular();
        if ( espacioCurricular == null ) {
            return null;
        }
        String nombre = espacioCurricular.getNombre();
        if ( nombre == null ) {
            return null;
        }
        return nombre;
    }

    private Long entitySituacionRevistaId(MovimientoHoras movimientoHoras) {
        if ( movimientoHoras == null ) {
            return null;
        }
        SituacionRevista situacionRevista = movimientoHoras.getSituacionRevista();
        if ( situacionRevista == null ) {
            return null;
        }
        Long id = situacionRevista.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entitySituacionRevistaNombre(MovimientoHoras movimientoHoras) {
        if ( movimientoHoras == null ) {
            return null;
        }
        SituacionRevista situacionRevista = movimientoHoras.getSituacionRevista();
        if ( situacionRevista == null ) {
            return null;
        }
        String nombre = situacionRevista.getNombre();
        if ( nombre == null ) {
            return null;
        }
        return nombre;
    }
}
