package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.Acta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActaRepository extends JpaRepository<Acta, Long> {
    Optional<Acta> findByMovimientoId(Long movimientoId);
    boolean existsByMovimientoId(Long movimientoId);
}