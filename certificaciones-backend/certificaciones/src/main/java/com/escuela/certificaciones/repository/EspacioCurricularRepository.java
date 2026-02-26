package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.EspacioCurricular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspacioCurricularRepository extends JpaRepository<EspacioCurricular, Long> {
}
