package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "situaciones_revista")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SituacionRevista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @OneToMany(mappedBy = "situacionRevista", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovimientoHoras> movimientos;
}
