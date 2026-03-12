package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.AuthDTOs.*;
import com.escuela.certificaciones.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Login y gestión de usuarios")
public class AuthController {

    private final AuthService authService;

    // ── POST /api/auth/login  (público) ────────────────────────
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ── GET /api/auth/usuarios  (solo ADMIN) ───────────────────
    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar usuarios", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(authService.findAll());
    }

    // ── POST /api/auth/usuarios  (solo ADMIN) ──────────────────
    @PostMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear usuario", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UsuarioResponse> crearUsuario(
            @Valid @RequestBody CrearUsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.crearUsuario(request));
    }

    // ── PATCH /api/auth/usuarios/{id}/toggle  (solo ADMIN) ────
    @PatchMapping("/usuarios/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activar/desactivar usuario")
    public ResponseEntity<UsuarioResponse> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(authService.toggleActivo(id));
    }

    // ── DELETE /api/auth/usuarios/{id}  (solo ADMIN) ──────────
    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        authService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ── GET /api/auth/me  (cualquier usuario autenticado) ─────
    @GetMapping("/me")
    @Operation(summary = "Obtener datos del usuario actual")
    public ResponseEntity<Map<String, String>> me(
            org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(Map.of(
                "username", auth.getName(),
                "roles", auth.getAuthorities().toString()
        ));
    }
}
