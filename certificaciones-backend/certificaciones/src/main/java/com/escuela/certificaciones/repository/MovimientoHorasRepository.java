package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.MovimientoHoras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoHorasRepository extends JpaRepository<MovimientoHoras, Long> {
    List<MovimientoHoras> findByDocenteIdOrderByFechaAltaAsc(Long docenteId);
}
