package com.escuela.certificaciones.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoCertificacionDTO {
    private Integer numero;
    private String espacioCurricular;
    private Integer cantidadHoras;
    private String curso;
    private String division;
    private String modalidad;
    private String situacionRevista;
    private LocalDate fechaAlta;
    private String instrumentoLegalAlta;
    private LocalDate fechaBaja;
    private String instrumentoLegalBaja;
    private String observaciones;
}
