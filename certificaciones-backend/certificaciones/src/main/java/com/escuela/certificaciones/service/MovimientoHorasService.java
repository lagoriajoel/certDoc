package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.MovimientoHorasDTO;
import com.escuela.certificaciones.entity.MovimientoHoras;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.MovimientoHorasMapper;
import com.escuela.certificaciones.repository.DocenteRepository;
import com.escuela.certificaciones.repository.EspacioCurricularRepository;
import com.escuela.certificaciones.repository.MovimientoHorasRepository;
import com.escuela.certificaciones.repository.SituacionRevistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MovimientoHorasService {

    private final MovimientoHorasRepository movimientoRepository;
    private final DocenteRepository docenteRepository;
    private final EspacioCurricularRepository espacioRepository;
    private final SituacionRevistaRepository situacionRepository;
    private final MovimientoHorasMapper mapper;

    @Transactional(readOnly = true)
    public List<MovimientoHorasDTO> findAll() {
        return movimientoRepository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MovimientoHorasDTO findById(Long id) {
        return movimientoRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("MovimientoHoras", id));
    }

    @Transactional(readOnly = true)
    public List<MovimientoHorasDTO> findByDocente(Long docenteId) {
        return movimientoRepository.findByDocenteIdOrderByFechaAltaAsc(docenteId)
                .stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public MovimientoHorasDTO create(MovimientoHorasDTO dto) {
        MovimientoHoras entity = buildEntityFromDTO(dto);
        return mapper.toDTO(movimientoRepository.save(entity));
    }

    public MovimientoHorasDTO update(Long id, MovimientoHorasDTO dto) {
        MovimientoHoras entity = movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MovimientoHoras", id));
        mapper.updateFromDTO(dto, entity);
        entity.setDocente(docenteRepository.findById(dto.getDocenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getDocenteId())));
        entity.setEspacioCurricular(espacioRepository.findById(dto.getEspacioCurricularId())
                .orElseThrow(() -> new ResourceNotFoundException("EspacioCurricular", dto.getEspacioCurricularId())));
        entity.setSituacionRevista(situacionRepository.findById(dto.getSituacionRevistaId())
                .orElseThrow(() -> new ResourceNotFoundException("SituacionRevista", dto.getSituacionRevistaId())));
        return mapper.toDTO(movimientoRepository.save(entity));
    }

    public void delete(Long id) {
        if (!movimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("MovimientoHoras", id);
        }
        movimientoRepository.deleteById(id);
    }

    private MovimientoHoras buildEntityFromDTO(MovimientoHorasDTO dto) {
        MovimientoHoras entity = mapper.toEntity(dto);
        entity.setDocente(docenteRepository.findById(dto.getDocenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getDocenteId())));
        entity.setEspacioCurricular(espacioRepository.findById(dto.getEspacioCurricularId())
                .orElseThrow(() -> new ResourceNotFoundException("EspacioCurricular", dto.getEspacioCurricularId())));
        entity.setSituacionRevista(situacionRepository.findById(dto.getSituacionRevistaId())
                .orElseThrow(() -> new ResourceNotFoundException("SituacionRevista", dto.getSituacionRevistaId())));
        return entity;
    }
}
