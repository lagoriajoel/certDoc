package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.EspacioCurricularDTO;
import com.escuela.certificaciones.entity.EspacioCurricular;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.EspacioCurricularMapper;
import com.escuela.certificaciones.repository.EspacioCurricularRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EspacioCurricularService {

    private final EspacioCurricularRepository repository;
    private final EspacioCurricularMapper mapper;

    @Transactional(readOnly = true)
    public List<EspacioCurricularDTO> findAll() {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EspacioCurricularDTO findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("EspacioCurricular", id));
    }

    public EspacioCurricularDTO create(EspacioCurricularDTO dto) {
        EspacioCurricular entity = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(entity));
    }

    public EspacioCurricularDTO update(Long id, EspacioCurricularDTO dto) {
        EspacioCurricular entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EspacioCurricular", id));
        mapper.updateFromDTO(dto, entity);
        return mapper.toDTO(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("EspacioCurricular", id);
        }
        repository.deleteById(id);
    }
}
