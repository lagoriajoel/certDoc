package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.SituacionRevistaDTO;
import com.escuela.certificaciones.entity.SituacionRevista;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-27T16:05:13-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17 (Oracle Corporation)"
)
@Component
public class SituacionRevistaMapperImpl implements SituacionRevistaMapper {

    @Override
    public SituacionRevistaDTO toDTO(SituacionRevista entity) {
        if ( entity == null ) {
            return null;
        }

        SituacionRevistaDTO.SituacionRevistaDTOBuilder situacionRevistaDTO = SituacionRevistaDTO.builder();

        situacionRevistaDTO.id( entity.getId() );
        situacionRevistaDTO.nombre( entity.getNombre() );

        return situacionRevistaDTO.build();
    }

    @Override
    public SituacionRevista toEntity(SituacionRevistaDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SituacionRevista.SituacionRevistaBuilder situacionRevista = SituacionRevista.builder();

        situacionRevista.id( dto.getId() );
        situacionRevista.nombre( dto.getNombre() );

        return situacionRevista.build();
    }

    @Override
    public void updateFromDTO(SituacionRevistaDTO dto, SituacionRevista entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setNombre( dto.getNombre() );
    }
}
