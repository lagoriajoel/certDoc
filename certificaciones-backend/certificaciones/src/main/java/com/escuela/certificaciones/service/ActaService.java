package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.ActaDTO;
import com.escuela.certificaciones.entity.Acta;
import com.escuela.certificaciones.entity.MovimientoHoras;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.mapper.ActaMapper;
import com.escuela.certificaciones.repository.ActaRepository;
import com.escuela.certificaciones.repository.MovimientoHorasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActaService {

    private final ActaRepository actaRepository;
    private final MovimientoHorasRepository movimientoRepository;
    private final ActaMapper mapper;

    @Transactional(readOnly = true)
    public ActaDTO findByMovimientoId(Long movimientoId) {
        return actaRepository.findByMovimientoId(movimientoId)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", movimientoId));
    }

    @Transactional(readOnly = true)
    public boolean existeActa(Long movimientoId) {
        return actaRepository.existsByMovimientoId(movimientoId);
    }

    public ActaDTO create(ActaDTO dto) {
        if (actaRepository.existsByMovimientoId(dto.getMovimientoId())) {
            throw new IllegalStateException("Ya existe un acta para este movimiento");
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