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
        return movimientoRepository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
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

    // ── Crear — construye la entidad con new para garantizar id = null ──
    public MovimientoHorasDTO create(MovimientoHorasDTO dto) {
        MovimientoHoras entity = new MovimientoHoras();
        setRelationsAndFields(entity, dto);
        MovimientoHoras saved = movimientoRepository.saveAndFlush(entity);
        return mapper.toDTO(saved);
    }

    // ── Actualizar — busca la entidad existente y la actualiza ──
    public MovimientoHorasDTO update(Long id, MovimientoHorasDTO dto) {
        MovimientoHoras entity = movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MovimientoHoras", id));
        setRelationsAndFields(entity, dto);
        return mapper.toDTO(movimientoRepository.save(entity));
    }

    public void delete(Long id) {
        if (!movimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("MovimientoHoras", id);
        }
        movimientoRepository.deleteById(id);
    }

    // ── Método compartido para setear campos y relaciones ──
    private void setRelationsAndFields(MovimientoHoras entity, MovimientoHorasDTO dto) {
        entity.setDocente(
                docenteRepository.findById(dto.getDocenteId())
                        .orElseThrow(() -> new ResourceNotFoundException("Docente", dto.getDocenteId()))
        );
        entity.setEspacioCurricular(
                espacioRepository.findById(dto.getEspacioCurricularId())
                        .orElseThrow(() -> new ResourceNotFoundException("EspacioCurricular", dto.getEspacioCurricularId()))
        );
        entity.setSituacionRevista(
                situacionRepository.findById(dto.getSituacionRevistaId())
                        .orElseThrow(() -> new ResourceNotFoundException("SituacionRevista", dto.getSituacionRevistaId()))
        );
        entity.setCantidadHoras(dto.getCantidadHoras());
        entity.setCurso(dto.getCurso());
        entity.setDivision(dto.getDivision());
        entity.setModalidad(dto.getModalidad());
        entity.setFechaAlta(dto.getFechaAlta());
        entity.setInstrumentoLegalAlta(dto.getInstrumentoLegalAlta());
        entity.setFechaBaja(dto.getFechaBaja());
        entity.setInstrumentoLegalBaja(dto.getInstrumentoLegalBaja());
        entity.setObservaciones(dto.getObservaciones());
    }
}