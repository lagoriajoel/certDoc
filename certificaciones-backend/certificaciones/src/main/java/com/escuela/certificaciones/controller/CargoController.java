package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.CargoDTO;
import com.escuela.certificaciones.service.CargoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargos")
@RequiredArgsConstructor
public class CargoController {

    private final CargoService cargoService;

    @GetMapping
    public List<CargoDTO> getAll() {
        return cargoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cargoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CargoDTO> create(@Valid @RequestBody CargoDTO dto) {
        return ResponseEntity.ok(cargoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CargoDTO> update(@PathVariable Long id, @Valid @RequestBody CargoDTO dto) {
        return ResponseEntity.ok(cargoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cargoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}