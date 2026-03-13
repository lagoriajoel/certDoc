package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.ActaDTO;
import com.escuela.certificaciones.entity.Acta.TipoActa;
import com.escuela.certificaciones.service.ActaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actas")
@RequiredArgsConstructor
@Tag(name = "Actas", description = "Gestión de actas administrativas")
public class ActaController {

    private final ActaService actaService;

    // Todas las actas de un movimiento
    @GetMapping("/movimiento/{movimientoId}")
    public ResponseEntity<List<ActaDTO>> getByMovimiento(@PathVariable Long movimientoId) {
        return ResponseEntity.ok(actaService.findByMovimientoId(movimientoId));
    }

    // Acta específica por movimiento y tipo
    @GetMapping("/movimiento/{movimientoId}/tipo/{tipoActa}")
    public ResponseEntity<ActaDTO> getByMovimientoYTipo(
            @PathVariable Long movimientoId,
            @PathVariable TipoActa tipoActa) {
        return ResponseEntity.ok(actaService.findByMovimientoIdAndTipo(movimientoId, tipoActa));
    }

    // Verificar si existe alguna acta para un movimiento
    @GetMapping("/movimiento/{movimientoId}/existe")
    public ResponseEntity<Map<String, Boolean>> existeActa(@PathVariable Long movimientoId) {
        return ResponseEntity.ok(Map.of("existe", actaService.existeActa(movimientoId)));
    }

    // Verificar si existe acta de un tipo específico
    @GetMapping("/movimiento/{movimientoId}/existe/{tipoActa}")
    public ResponseEntity<Map<String, Boolean>> existeActaPorTipo(
            @PathVariable Long movimientoId,
            @PathVariable TipoActa tipoActa) {
        return ResponseEntity.ok(Map.of("existe", actaService.existeActaPorTipo(movimientoId, tipoActa)));
    }

    // Crear acta
    @PostMapping
    public ResponseEntity<ActaDTO> create(@RequestBody ActaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actaService.create(dto));
    }

    // Actualizar acta
    @PutMapping("/{id}")
    public ResponseEntity<ActaDTO> update(@PathVariable Long id, @RequestBody ActaDTO dto) {
        return ResponseEntity.ok(actaService.update(id, dto));
    }

    // Eliminar acta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        actaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}