package com.escuela.certificaciones.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificacionResponseDTO {
    private Long docenteId;
    private String apellidoNombre;
    private String dni;
    private List<MovimientoCertificacionDTO> movimientos;
    private Integer totalHorasActivas;
    private String notaPie;
}
