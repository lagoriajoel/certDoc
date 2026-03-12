package com.escuela.certificaciones.dto;

import com.escuela.certificaciones.entity.Acta.TipoActa;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActaDTO {

    private Long id;
    private Long movimientoId;
    private TipoActa tipoActa;
    private String numeroDisposicion;
    private LocalDate fechaActa;
    private String nombreDirectivo;
    private String visto;
    private String considerando;
    private String articulos;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Datos del movimiento para mostrar en el acta
    private String docenteNombre;
    private String docenteDni;
    private String espacioCurricular;
    private Integer cantidadHoras;
    private String curso;
    private String division;
    private String situacionRevista;
    private String instrumentoLegalAlta;
    private String instrumentoLegalBaja;
}