package com.escuela.certificaciones.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "actas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Acta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimiento_id", nullable = false)
    private MovimientoHoras movimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoActa tipoActa;

    @Column(name = "numero_disposicion", nullable = false, length = 100)
    private String numeroDisposicion;

    @Column(name = "fecha_acta", nullable = false)
    private LocalDate fechaActa;

    @Column(name = "nombre_directivo", nullable = false, length = 200)
    private String nombreDirectivo;

    @Column(columnDefinition = "TEXT")
    private String visto;

    @Column(columnDefinition = "TEXT")
    private String considerando;

    @Column(columnDefinition = "TEXT")
    private String articulos;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum TipoActa {
        ALTA_HORAS,
        BAJA_HORAS,
        CAMBIO_SITUACION_REVISTA
    }
}