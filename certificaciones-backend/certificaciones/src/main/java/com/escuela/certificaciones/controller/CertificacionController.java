package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.CertificacionResponseDTO;
import com.escuela.certificaciones.service.CertificacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificaciones")
@RequiredArgsConstructor
@Tag(name = "Certificaciones", description = "Generación de certificaciones de servicios docentes")
public class CertificacionController {

    private final CertificacionService certificacionService;

    @GetMapping("/{docenteId}")
    @Operation(summary = "Obtener certificación en formato JSON")
    public ResponseEntity<CertificacionResponseDTO> getCertificacion(@PathVariable Long docenteId) {
        return ResponseEntity.ok(certificacionService.getCertificacion(docenteId));
    }

    @GetMapping("/{docenteId}/pdf")
    @Operation(summary = "Descargar certificación en formato PDF")
    public ResponseEntity<byte[]> getCertificacionPdf(@PathVariable Long docenteId) {
        byte[] pdf = certificacionService.generatePdf(docenteId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment",
                "certificacion_docente_" + docenteId + ".pdf");
        headers.setContentLength(pdf.length);
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
