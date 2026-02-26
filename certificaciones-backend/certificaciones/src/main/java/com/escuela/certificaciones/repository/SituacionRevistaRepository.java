package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.SituacionRevista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SituacionRevistaRepository extends JpaRepository<SituacionRevista, Long> {
}
