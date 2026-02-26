package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.DocenteDTO;
import com.escuela.certificaciones.entity.Docente;
import com.escuela.certificaciones.exception.BusinessException;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.DocenteMapper;
import com.escuela.certificaciones.repository.DocenteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DocenteService {

    private final DocenteRepository docenteRepository;
    private final DocenteMapper docenteMapper;

    @Transactional(readOnly = true)
    public List<DocenteDTO> findAll() {
        return docenteRepository.findAll()
                .stream()
                .map(docenteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocenteDTO findById(Long id) {
        return docenteRepository.findById(id)
                .map(docenteMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Docente", id));
    }

    public DocenteDTO create(DocenteDTO dto) {
        if (docenteRepository.existsByDni(dto.getDni())) {
            throw new BusinessException("Ya existe un docente con DNI: " + dto.getDni());
        }
        Docente docente = docenteMapper.toEntity(dto);
        return docenteMapper.toDTO(docenteRepository.save(docente));
    }

    public DocenteDTO update(Long id, DocenteDTO dto) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente", id));

        if (!docente.getDni().equals(dto.getDni()) && docenteRepository.existsByDni(dto.getDni())) {
            throw new BusinessException("Ya existe un docente con DNI: " + dto.getDni());
        }

        docenteMapper.updateFromDTO(dto, docente);
        return docenteMapper.toDTO(docenteRepository.save(docente));
    }

    public void delete(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Docente", id);
        }
        docenteRepository.deleteById(id);
    }
}
