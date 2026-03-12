package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "docentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String dni;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 50)
    private String legajo;

    @Column(name = "titulo_docente", length = 200)
    private String tituloDocente;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Column(length = 150)
    private String email;

    @OneToMany(mappedBy = "docente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovimientoHoras> movimientos;
}