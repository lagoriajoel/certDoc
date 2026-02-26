package com.escuela.certificaciones.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SituacionRevistaDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}
