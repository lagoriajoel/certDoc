package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.Acta;
import com.escuela.certificaciones.entity.Acta.TipoActa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActaRepository extends JpaRepository<Acta, Long> {

    // Todas las actas de un movimiento
    List<Acta> findByMovimientoId(Long movimientoId);

    // Acta específica por movimiento y tipo (ALTA o BAJA)
    Optional<Acta> findByMovimientoIdAndTipoActa(Long movimientoId, TipoActa tipoActa);

    // Verificar si existe acta de un tipo específico
    boolean existsByMovimientoIdAndTipoActa(Long movimientoId, TipoActa tipoActa);

    // Verificar si existe alguna acta para el movimiento
    boolean existsByMovimientoId(Long movimientoId);

    // Eliminar todas las actas de un movimiento
    void deleteByMovimientoId(Long movimientoId);
}