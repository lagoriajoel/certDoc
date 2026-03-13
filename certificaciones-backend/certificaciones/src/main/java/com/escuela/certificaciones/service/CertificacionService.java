package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.CertificacionResponseDTO;
import com.escuela.certificaciones.dto.MovimientoCertificacionDTO;
import com.escuela.certificaciones.entity.Docente;
import com.escuela.certificaciones.entity.MovimientoHoras;
import com.escuela.certificaciones.entity.MovimientoHoras.TipoMovimiento;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.pdf.PdfCertificacionGenerator;
import com.escuela.certificaciones.repository.DocenteRepository;
import com.escuela.certificaciones.repository.MovimientoHorasRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CertificacionService {

    private final DocenteRepository docenteRepository;
    private final MovimientoHorasRepository movimientoRepository;
    private final PdfCertificacionGenerator pdfGenerator;

    public CertificacionResponseDTO getCertificacion(Long docenteId) {
        Docente docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new ResourceNotFoundException("Docente", docenteId));

        List<MovimientoHoras> movimientos = movimientoRepository
                .findByDocenteIdOrderByFechaAltaAsc(docenteId);

        AtomicInteger counter = new AtomicInteger(1);
        List<MovimientoCertificacionDTO> movimientosDTO = movimientos.stream()
                .map(m -> mapToMovimientoCertificacion(m, counter.getAndIncrement()))
                .collect(Collectors.toList());

        // Total horas activas — solo cuenta movimientos de horas cátedra
        int totalHorasActivas = movimientos.stream()
                .filter(m -> m.getFechaBaja() == null)
                .filter(m -> m.getTipo() == TipoMovimiento.HORAS_CATEDRA)
                .filter(m -> m.getCantidadHoras() != null)
                .mapToInt(MovimientoHoras::getCantidadHoras)
                .sum();

        return CertificacionResponseDTO.builder()
                .docenteId(docente.getId())
                .apellidoNombre(docente.getApellido() + ", " + docente.getNombre())
                .dni(docente.getDni())
                .movimientos(movimientosDTO)
                .totalHorasActivas(totalHorasActivas)
                .build();
    }

    public byte[] generatePdf(Long docenteId) {
        CertificacionResponseDTO certificacion = getCertificacion(docenteId);
        return pdfGenerator.generate(certificacion);
    }

    private MovimientoCertificacionDTO mapToMovimientoCertificacion(MovimientoHoras m, int numero) {
        String observaciones = m.getObservaciones();
        if (m.getFechaBaja() == null) {
            observaciones = (observaciones != null && !observaciones.isBlank())
                    ? observaciones + " - Continúa"
                    : "Continúa";
        }

        MovimientoCertificacionDTO.MovimientoCertificacionDTOBuilder builder =
                MovimientoCertificacionDTO.builder()
                        .numero(numero)
                        .tipo(m.getTipo())
                        .situacionRevista(m.getSituacionRevista().getNombre())
                        .fechaAlta(m.getFechaAlta())
                        .instrumentoLegalAlta(m.getInstrumentoLegalAlta())
                        .fechaBaja(m.getFechaBaja())
                        .instrumentoLegalBaja(m.getInstrumentoLegalBaja())
                        .observaciones(observaciones);

        if (m.getTipo() == TipoMovimiento.HORAS_CATEDRA) {
            builder
                    .espacioCurricular(m.getEspacioCurricular() != null ? m.getEspacioCurricular().getNombre() : "")
                    .cantidadHoras(m.getCantidadHoras())
                    .modalidad(m.getModalidad())
                    .curso(m.getCurso())
                    .division(m.getDivision());
        } else {
            // CARGO
            builder
                    .cargo(m.getCargo() != null ? m.getCargo().getNombre() : "")
                    .curso(m.getCurso())      // null para Rector/Secretario, valor para Preceptor
                    .division(m.getDivision());
        }

        return builder.build();
    }
}