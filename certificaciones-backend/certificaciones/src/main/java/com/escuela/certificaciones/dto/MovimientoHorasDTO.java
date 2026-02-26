package com.escuela.certificaciones.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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

    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;

    @NotNull(message = "El espacio curricular es obligatorio")
    private Long espacioCurricularId;

    private String espacioCurricularNombre;

    @NotBlank(message = "El curso es obligatorio")
    private String curso;

    @NotBlank(message = "La división es obligatoria")
    private String division;

    @NotBlank(message = "La modalidad es obligatoria")
    private String modalidad;

    @NotNull(message = "La cantidad de horas es obligatoria")
    @Min(value = 1, message = "La cantidad de horas debe ser mayor a 0")
    private Integer cantidadHoras;

    @NotNull(message = "La situación de revista es obligatoria")
    private Long situacionRevistaId;

    private String situacionRevistaNombre;

    @NotNull(message = "La fecha de alta es obligatoria")
    private LocalDate fechaAlta;

    @NotBlank(message = "El instrumento legal de alta es obligatorio")
    private String instrumentoLegalAlta;

    private LocalDate fechaBaja;
    private String instrumentoLegalBaja;
    private String observaciones;
}
