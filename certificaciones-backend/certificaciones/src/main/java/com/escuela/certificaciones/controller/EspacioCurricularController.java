package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.EspacioCurricularDTO;
import com.escuela.certificaciones.service.EspacioCurricularService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/espacios-curriculares")
@RequiredArgsConstructor
@Tag(name = "Espacios Curriculares", description = "CRUD de espacios curriculares")
public class EspacioCurricularController {

    private final EspacioCurricularService service;

    @GetMapping
    @Operation(summary = "Listar todos los espacios curriculares")
    public ResponseEntity<List<EspacioCurricularDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener espacio curricular por ID")
    public ResponseEntity<EspacioCurricularDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear espacio curricular")
    public ResponseEntity<EspacioCurricularDTO> create(@Valid @RequestBody EspacioCurricularDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar espacio curricular")
    public ResponseEntity<EspacioCurricularDTO> update(@PathVariable Long id, @Valid @RequestBody EspacioCurricularDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar espacio curricular")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
