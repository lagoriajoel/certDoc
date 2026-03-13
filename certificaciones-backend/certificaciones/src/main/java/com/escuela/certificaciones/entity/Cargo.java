package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "cargos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    // Si el cargo requiere curso/división (ej: Preceptor) o no (ej: Rector)
    @Column(name = "requiere_curso", nullable = false)
    private Boolean requiereCurso = false;

    @OneToMany(mappedBy = "cargo", fetch = FetchType.LAZY)
    private List<MovimientoHoras> movimientos;
}