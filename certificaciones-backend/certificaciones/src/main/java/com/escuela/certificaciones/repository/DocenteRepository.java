package com.escuela.certificaciones.repository;

import com.escuela.certificaciones.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Optional<Docente> findByDni(String dni);
    boolean existsByDni(String dni);
}
