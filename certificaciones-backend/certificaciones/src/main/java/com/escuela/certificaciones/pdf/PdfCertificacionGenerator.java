package com.escuela.certificaciones.pdf;

import com.escuela.certificaciones.dto.CertificacionResponseDTO;
import com.escuela.certificaciones.dto.MovimientoCertificacionDTO;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class PdfCertificacionGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Font FONT_TITLE = new Font(Font.HELVETICA, 14, Font.BOLD);
    private static final Font FONT_SUBTITLE = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font FONT_NORMAL = new Font(Font.HELVETICA, 9, Font.NORMAL);
    private static final Font FONT_BOLD = new Font(Font.HELVETICA, 9, Font.BOLD);
    private static final Font FONT_HEADER = new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
    private static final Font FONT_SMALL = new Font(Font.HELVETICA, 8, Font.NORMAL);

    public byte[] generate(CertificacionResponseDTO certificacion) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            addTitle(document);
            addIntroText(document, certificacion);
            addMovimientosTable(document, certificacion);
            addTotalHoras(document, certificacion.getTotalHorasActivas());
            addFooter(document);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generando PDF de certificación", e);
            throw new RuntimeException("Error al generar el PDF de certificación", e);
        }
    }

    private void addTitle(Document document) throws DocumentException {
        Paragraph title = new Paragraph("CERTIFICACIÓN DE SERVICIOS DOCENTES", FONT_TITLE);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(5);
        document.add(title);

        Paragraph separator = new Paragraph(" ");
        separator.setSpacingAfter(10);
        document.add(separator);
    }

    private void addIntroText(Document document, CertificacionResponseDTO cert) throws DocumentException {
        Paragraph intro = new Paragraph();
        intro.setFont(FONT_NORMAL);
        intro.setAlignment(Element.ALIGN_JUSTIFIED);
        intro.setSpacingAfter(15);
        intro.add(new Chunk("La Dirección de la Escuela deja constancia que el/la Prof. ", FONT_NORMAL));
        intro.add(new Chunk(cert.getApellidoNombre(), FONT_BOLD));
        intro.add(new Chunk(", DNI ", FONT_NORMAL));
        intro.add(new Chunk(cert.getDni(), FONT_BOLD));
        intro.add(new Chunk(
                " ha prestado servicios en esta institución según el siguiente detalle:", FONT_NORMAL));
        document.add(intro);
    }

    private void addMovimientosTable(Document document, CertificacionResponseDTO cert) throws DocumentException {
        // 10 columns
        float[] widths = {3f, 12f, 5f, 5f, 5f, 8f, 9f, 10f, 10f, 12f};
        PdfPTable table = new PdfPTable(widths);
        table.setWidthPercentage(100);
        table.setSpacingAfter(15);

        // Header row
        String[] headers = {"Nº", "Espacio Curricular", "Horas", "Curso", "División",
                "Modalidad", "Situación Revista", "Alta", "Baja", "Observaciones"};
        Color headerColor = new Color(44, 62, 80);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FONT_HEADER));
            cell.setBackgroundColor(headerColor);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setPadding(5);
            table.addCell(cell);
        }

        // Data rows
        boolean alternate = false;
        Color altColor = new Color(236, 240, 241);
        for (MovimientoCertificacionDTO m : cert.getMovimientos()) {
            Color rowColor = alternate ? altColor : Color.WHITE;
            addDataCell(table, String.valueOf(m.getNumero()), rowColor, Element.ALIGN_CENTER);
            addDataCell(table, m.getEspacioCurricular(), rowColor, Element.ALIGN_LEFT);
            addDataCell(table, String.valueOf(m.getCantidadHoras()), rowColor, Element.ALIGN_CENTER);
            addDataCell(table, m.getCurso(), rowColor, Element.ALIGN_CENTER);
            addDataCell(table, m.getDivision(), rowColor, Element.ALIGN_CENTER);
            addDataCell(table, m.getModalidad(), rowColor, Element.ALIGN_LEFT);
            addDataCell(table, m.getSituacionRevista(), rowColor, Element.ALIGN_LEFT);
            addDataCell(table, formatAltaBaja(m.getFechaAlta(), m.getInstrumentoLegalAlta()), rowColor, Element.ALIGN_LEFT);
            addDataCell(table, formatAltaBaja(m.getFechaBaja(), m.getInstrumentoLegalBaja()), rowColor, Element.ALIGN_LEFT);
            addDataCell(table, nvl(m.getObservaciones()), rowColor, Element.ALIGN_LEFT);
            alternate = !alternate;
        }

        document.add(table);
    }

    private void addDataCell(PdfPTable table, String text, Color bgColor, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", FONT_SMALL));
        cell.setBackgroundColor(bgColor);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(4);
        table.addCell(cell);
    }

    private String formatAltaBaja(LocalDate fecha, String instrumento) {
        if (fecha == null) return "-";
        String result = fecha.format(DATE_FORMAT);
        if (instrumento != null && !instrumento.isBlank()) {
            result += "\n" + instrumento;
        }
        return result;
    }

    private void addTotalHoras(Document document, int total) throws DocumentException {
        Paragraph totalP = new Paragraph();
        totalP.add(new Chunk("Total de horas activas: ", FONT_BOLD));
        totalP.add(new Chunk(String.valueOf(total), FONT_BOLD));
        totalP.setSpacingAfter(30);
        document.add(totalP);
    }

    private void addFooter(Document document) throws DocumentException {
        String lugar = "..........................................";
        String fecha = LocalDate.now().format(DATE_FORMAT);

        Paragraph lugarFecha = new Paragraph("Lugar y fecha: " + lugar + ", " + fecha, FONT_NORMAL);
        lugarFecha.setSpacingAfter(40);
        document.add(lugarFecha);

        // Firma y sello en columnas simuladas con tabla invisible
        PdfPTable footerTable = new PdfPTable(2);
        footerTable.setWidthPercentage(80);

        PdfPCell firmaCell = new PdfPCell();
        firmaCell.setBorder(Rectangle.NO_BORDER);
        firmaCell.addElement(new Paragraph("_________________________________", FONT_NORMAL));
        firmaCell.addElement(new Paragraph("Firma y Aclaración", FONT_SMALL));
        firmaCell.addElement(new Paragraph("Director/a", FONT_SMALL));
        footerTable.addCell(firmaCell);

        PdfPCell selloCell = new PdfPCell();
        selloCell.setBorder(Rectangle.NO_BORDER);
        selloCell.addElement(new Paragraph("_________________________________", FONT_NORMAL));
        selloCell.addElement(new Paragraph("Sello Institucional", FONT_SMALL));
        footerTable.addCell(selloCell);

        document.add(footerTable);
    }

    private String nvl(String value) {
        return value != null ? value : "";
    }
}
