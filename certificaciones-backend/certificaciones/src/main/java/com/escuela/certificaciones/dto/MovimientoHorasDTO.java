package com.escuela.certificaciones.dto;

import com.escuela.certificaciones.entity.MovimientoHoras.TipoMovimiento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoHorasDTO {
    private Long id;

    // Tipo de movimiento — default HORAS_CATEDRA para compatibilidad con datos existentes
    private TipoMovimiento tipo = TipoMovimiento.HORAS_CATEDRA;

    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;

    // ── Campos HORAS_CATEDRA ──
    private Long espacioCurricularId;
    private String espacioCurricularNombre;
    private String modalidad;

    @Min(value = 1, message = "La cantidad de horas debe ser mayor a 0")
    private Integer cantidadHoras;

    // ── Campos CARGO ──
    private Long cargoId;
    private String cargoNombre;
    private Boolean cargoRequiereCurso;

    // ── Curso/División (horas cátedra y preceptor) ──
    private String curso;
    private String division;

    // ── Campos comunes ──
    @NotNull(message = "La situación de revista es obligatoria")
    private Long situacionRevistaId;

    private String situacionRevistaNombre;

    @NotNull(message = "La fecha de alta es obligatoria")
    private LocalDate fechaAlta;

    private String instrumentoLegalAlta;

    private LocalDate fechaBaja;
    private String instrumentoLegalBaja;
    private String observaciones;
}