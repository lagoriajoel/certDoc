package com.escuela.certificaciones.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

// ── Request ──────────────────────────────────────────────────
public class AuthDTOs {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "El usuario es obligatorio")
        private String username;

        @NotBlank(message = "La contraseña es obligatoria")
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LoginResponse {
        private String token;
        private String username;
        private String nombre;
        private String rol;
        private long expiresIn;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UsuarioResponse {
        private Long id;
        private String username;
        private String nombre;
        private String rol;
        private boolean activo;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CrearUsuarioRequest {
        @NotBlank private String username;
        @NotBlank private String password;
        @NotBlank private String nombre;
        private String rol = "OPERADOR";
    }
}
