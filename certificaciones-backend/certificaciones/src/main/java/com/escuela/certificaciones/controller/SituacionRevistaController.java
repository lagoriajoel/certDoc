package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.SituacionRevistaDTO;
import com.escuela.certificaciones.service.SituacionRevistaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/situaciones-revista")
@RequiredArgsConstructor
@Tag(name = "Situaciones de Revista", description = "CRUD de situaciones de revista (Titular, Interino, Suplente)")
public class SituacionRevistaController {

    private final SituacionRevistaService service;

    @GetMapping
    @Operation(summary = "Listar todas las situaciones de revista")
    public ResponseEntity<List<SituacionRevistaDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener situación de revista por ID")
    public ResponseEntity<SituacionRevistaDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear situación de revista")
    public ResponseEntity<SituacionRevistaDTO> create(@Valid @RequestBody SituacionRevistaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar situación de revista")
    public ResponseEntity<SituacionRevistaDTO> update(@PathVariable Long id,
                                                       @Valid @RequestBody SituacionRevistaDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar situación de revista")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
