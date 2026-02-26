package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "espacios_curriculares")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EspacioCurricular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @OneToMany(mappedBy = "espacioCurricular", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovimientoHoras> movimientos;
}
