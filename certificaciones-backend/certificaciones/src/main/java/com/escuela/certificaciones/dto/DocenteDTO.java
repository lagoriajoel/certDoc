package com.escuela.certificaciones.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocenteDTO {

    private Long id;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(max = 20, message = "El DNI no puede superar 20 caracteres")
    private String dni;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar 100 caracteres")
    private String apellido;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @Size(max = 50, message = "El legajo no puede superar 50 caracteres")
    private String legajo;

    @Size(max = 200, message = "El título no puede superar 200 caracteres")
    private String tituloDocente;

    private LocalDate fechaIngreso;

    @Email(message = "El email no tiene formato válido")
    @Size(max = 150, message = "El email no puede superar 150 caracteres")
    private String email;
}