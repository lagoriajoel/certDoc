package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.SituacionRevistaDTO;
import com.escuela.certificaciones.entity.SituacionRevista;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.SituacionRevistaMapper;
import com.escuela.certificaciones.repository.SituacionRevistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SituacionRevistaService {

    private final SituacionRevistaRepository repository;
    private final SituacionRevistaMapper mapper;

    @Transactional(readOnly = true)
    public List<SituacionRevistaDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SituacionRevistaDTO findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("SituacionRevista", id));
    }

    public SituacionRevistaDTO create(SituacionRevistaDTO dto) {
        SituacionRevista entity = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(entity));
    }

    public SituacionRevistaDTO update(Long id, SituacionRevistaDTO dto) {
        SituacionRevista entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SituacionRevista", id));
        mapper.updateFromDTO(dto, entity);
        return mapper.toDTO(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("SituacionRevista", id);
        }
        repository.deleteById(id);
    }
}
