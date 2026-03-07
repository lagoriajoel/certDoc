package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.DocenteDTO;
import com.escuela.certificaciones.entity.Docente;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-26T10:10:28-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17 (Oracle Corporation)"
)
@Component
public class DocenteMapperImpl implements DocenteMapper {

    @Override
    public DocenteDTO toDTO(Docente docente) {
        if ( docente == null ) {
            return null;
        }

        DocenteDTO.DocenteDTOBuilder docenteDTO = DocenteDTO.builder();

        docenteDTO.id( docente.getId() );
        docenteDTO.dni( docente.getDni() );
        docenteDTO.apellido( docente.getApellido() );
        docenteDTO.nombre( docente.getNombre() );

        return docenteDTO.build();
    }

    @Override
    public Docente toEntity(DocenteDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Docente.DocenteBuilder docente = Docente.builder();

        docente.id( dto.getId() );
        docente.dni( dto.getDni() );
        docente.apellido( dto.getApellido() );
        docente.nombre( dto.getNombre() );

        return docente.build();
    }

    @Override
    public void updateFromDTO(DocenteDTO dto, Docente docente) {
        if ( dto == null ) {
            return;
        }

        docente.setId( dto.getId() );
        docente.setDni( dto.getDni() );
        docente.setApellido( dto.getApellido() );
        docente.setNombre( dto.getNombre() );
    }
}
