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

    public enum TipoMovimiento {
        HORAS_CATEDRA,
        CARGO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Tipo de movimiento ──────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoMovimiento tipo = TipoMovimiento.HORAS_CATEDRA;

    // ── Docente ─────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Docente docente;

    // ── Campos para HORAS_CATEDRA (nullable para CARGO) ─
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "espacio_curricular_id", nullable = true)
    private EspacioCurricular espacioCurricular;

    @Column(length = 100)
    private String modalidad;

    @Column(name = "cantidad_horas")
    private Integer cantidadHoras;

    // ── Campos para CARGO (nullable para HORAS_CATEDRA) ─
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cargo_id", nullable = true)
    private Cargo cargo;

    // ── Curso y División (HORAS_CATEDRA y Preceptor) ────
    @Column(length = 20)
    private String curso;

    @Column(length = 10)
    private String division;

    // ── Campos comunes ───────────────────────────────────
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

    @OneToOne(mappedBy = "movimiento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Acta acta;
}