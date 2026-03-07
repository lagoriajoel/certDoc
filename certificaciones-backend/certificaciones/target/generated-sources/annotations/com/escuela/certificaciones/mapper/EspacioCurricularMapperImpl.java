package com.escuela.certificaciones.mapper;

import com.escuela.certificaciones.dto.EspacioCurricularDTO;
import com.escuela.certificaciones.entity.EspacioCurricular;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-26T10:10:28-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17 (Oracle Corporation)"
)
@Component
public class EspacioCurricularMapperImpl implements EspacioCurricularMapper {

    @Override
    public EspacioCurricularDTO toDTO(EspacioCurricular entity) {
        if ( entity == null ) {
            return null;
        }

        EspacioCurricularDTO.EspacioCurricularDTOBuilder espacioCurricularDTO = EspacioCurricularDTO.builder();

        espacioCurricularDTO.id( entity.getId() );
        espacioCurricularDTO.nombre( entity.getNombre() );

        return espacioCurricularDTO.build();
    }

    @Override
    public EspacioCurricular toEntity(EspacioCurricularDTO dto) {
        if ( dto == null ) {
            return null;
        }

        EspacioCurricular.EspacioCurricularBuilder espacioCurricular = EspacioCurricular.builder();

        espacioCurricular.id( dto.getId() );
        espacioCurricular.nombre( dto.getNombre() );

        return espacioCurricular.build();
    }

    @Override
    public void updateFromDTO(EspacioCurricularDTO dto, EspacioCurricular entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setNombre( dto.getNombre() );
    }
}
