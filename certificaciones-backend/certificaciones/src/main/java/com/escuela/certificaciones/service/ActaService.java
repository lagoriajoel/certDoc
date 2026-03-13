package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.ActaDTO;
import com.escuela.certificaciones.entity.Acta;
import com.escuela.certificaciones.entity.Acta.TipoActa;
import com.escuela.certificaciones.entity.MovimientoHoras;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.ActaMapper;
import com.escuela.certificaciones.repository.ActaRepository;
import com.escuela.certificaciones.repository.MovimientoHorasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActaService {

    private final ActaRepository actaRepository;
    private final MovimientoHorasRepository movimientoRepository;
    private final ActaMapper mapper;

    // Todas las actas de un movimiento
    @Transactional(readOnly = true)
    public List<ActaDTO> findByMovimientoId(Long movimientoId) {
        return actaRepository.findByMovimientoId(movimientoId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // Acta específica por movimiento y tipo
    @Transactional(readOnly = true)
    public ActaDTO findByMovimientoIdAndTipo(Long movimientoId, TipoActa tipoActa) {
        return actaRepository.findByMovimientoIdAndTipoActa(movimientoId, tipoActa)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", movimientoId));
    }

    // Verifica si existe alguna acta para el movimiento
    @Transactional(readOnly = true)
    public boolean existeActa(Long movimientoId) {
        return actaRepository.existsByMovimientoId(movimientoId);
    }

    // Verifica si existe acta de un tipo específico
    @Transactional(readOnly = true)
    public boolean existeActaPorTipo(Long movimientoId, TipoActa tipoActa) {
        return actaRepository.existsByMovimientoIdAndTipoActa(movimientoId, tipoActa);
    }

    public ActaDTO create(ActaDTO dto) {
        // Verificar que no exista ya un acta del mismo tipo para este movimiento
        if (actaRepository.existsByMovimientoIdAndTipoActa(dto.getMovimientoId(), dto.getTipoActa())) {
            throw new IllegalStateException(
                    "Ya existe un acta de tipo " + dto.getTipoActa() + " para este movimiento"
            );
        }

        MovimientoHoras movimiento = movimientoRepository.findById(dto.getMovimientoId())
                .orElseThrow(() -> new ResourceNotFoundException("MovimientoHoras", dto.getMovimientoId()));

        Acta acta = new Acta();
        acta.setMovimiento(movimiento);
        acta.setTipoActa(dto.getTipoActa());
        acta.setNumeroDisposicion(dto.getNumeroDisposicion());
        acta.setFechaActa(dto.getFechaActa());
        acta.setNombreDirectivo(dto.getNombreDirectivo());
        acta.setVisto(dto.getVisto());
        acta.setConsiderando(dto.getConsiderando());
        acta.setArticulos(dto.getArticulos());

        return mapper.toDTO(actaRepository.saveAndFlush(acta));
    }

    public ActaDTO update(Long id, ActaDTO dto) {
        Acta acta = actaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", id));
        acta.setNumeroDisposicion(dto.getNumeroDisposicion());
        acta.setFechaActa(dto.getFechaActa());
        acta.setNombreDirectivo(dto.getNombreDirectivo());
        acta.setVisto(dto.getVisto());
        acta.setConsiderando(dto.getConsiderando());
        acta.setArticulos(dto.getArticulos());
        return mapper.toDTO(actaRepository.save(acta));
    }

    public void delete(Long id) {
        if (!actaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Acta", id);
        }
        actaRepository.deleteById(id);
    }
}