package com.escuela.certificaciones.dto;

import com.escuela.certificaciones.entity.MovimientoHoras.TipoMovimiento;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoCertificacionDTO {
    private Integer numero;
    private TipoMovimiento tipo;

    // HORAS_CATEDRA
    private String espacioCurricular;
    private Integer cantidadHoras;
    private String modalidad;

    // CARGO
    private String cargo;

    // Horas cátedra y Preceptor
    private String curso;
    private String division;

    // Comunes
    private String situacionRevista;
    private LocalDate fechaAlta;
    private String instrumentoLegalAlta;
    private LocalDate fechaBaja;
    private String instrumentoLegalBaja;
    private String observaciones;
}