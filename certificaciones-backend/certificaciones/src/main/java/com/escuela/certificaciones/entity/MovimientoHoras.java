package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "movimientos_horas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoHoras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Docente docente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "espacio_curricular_id", nullable = false)
    private EspacioCurricular espacioCurricular;

    @Column(nullable = false, length = 20)
    private String curso;

    @Column(nullable = false, length = 10)
    private String division;

    @Column(nullable = false, length = 100)
    private String modalidad;

    @Column(nullable = false)
    private Integer cantidadHoras;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "situacion_revista_id", nullable = false)
    private SituacionRevista situacionRevista;

    @Column(nullable = false)
    private LocalDate fechaAlta;

    @Column(nullable = false, length = 200)
    private String instrumentoLegalAlta;

    @Column
    private LocalDate fechaBaja;

    @Column(length = 200)
    private String instrumentoLegalBaja;

    @Column(length = 500)
    private String observaciones;
}
