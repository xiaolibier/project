package com.zhb.pdf;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.IOException;

/**
 * Created by zhouhaibin on 2016/11/19.
 */
public class ReportHeaderFooter extends PdfPageEventHelper {
    String reportId;
    static Image logo;

    PdfTemplate total;
    static {
        try {
            String logoFileName = Image.class.getResource("/").toString() + "logo.png";
            logo = Image.getInstance(logoFileName);
        } catch (BadElementException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        logo.scaleToFit(28, 38);
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public void onOpenDocument(PdfWriter writer, Document document) {
        total = writer.getDirectContent().createTemplate(30, 16);
    }

    public void onEndPage(PdfWriter writer, Document document) {
        PdfContentByte cb = writer.getDirectContent();
        float headerLeft = document.left();
        float headerRight = document.right();
        float headerTop = document.top() + 20;
        float footerBottom = document.bottom();

        //页眉
        try {
            logo.setAbsolutePosition(headerLeft, headerTop + 5);
            cb.addImage(logo);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                new Phrase("北京经纬传奇医药科技有限公司", new Font(ReportFont.baseFontMSYH, 9)),
                headerLeft + 36, headerTop + 25, 0);
        ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                new Phrase("3AUDIT.COM | 专业稽查  信心标志", new Font(ReportFont.baseFontMSYH, 8)),
                headerLeft + 36, headerTop + 13, 0);
        ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                new Phrase("文件编号：" + reportId, new Font(ReportFont.baseFontMSYH, 9)),
                headerRight, headerTop + 14 , 0);

        //draw a line
        PdfPTable table = new PdfPTable(1);
        table.setTotalWidth(headerRight - headerLeft);
        table.setLockedWidth(true);
        PdfPCell cell = new PdfPCell(new Phrase(""));
        cell.setBorder(PdfPCell.TOP);
        table.addCell(cell);
        table.writeSelectedRows(0, -1, headerLeft, headerTop, cb);

        //页脚
        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                new Phrase("保密文件（Confidential）", new Font(ReportFont.baseFontHWFS, (float)10.5, Font.ITALIC)),
                (headerRight - headerLeft) / 2 + document.leftMargin(),
                footerBottom - 45, 0);

        table = new PdfPTable(2);
        try {
            table.setWidths(new int[]{24, 2});
            table.setTotalWidth(headerRight - headerLeft);
            table.setLockedWidth(true);
            table.getDefaultCell().setFixedHeight(20);
            table.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
            table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell = new PdfPCell(new Phrase(String.format("%d /", writer.getPageNumber()), FontFactory.getFont("Times New Roman", 9)));
            cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell.setVerticalAlignment(Element.ALIGN_BOTTOM);
            cell.setBorder(PdfPCell.TOP);
            table.addCell(cell);
            cell = new PdfPCell(Image.getInstance(total));
            cell.setBorder(PdfPCell.TOP);
            cell.setVerticalAlignment(Element.ALIGN_BOTTOM);
            table.addCell(cell);
            table.writeSelectedRows(0, -1, headerLeft, footerBottom - 15, cb);
        }
        catch(DocumentException de) {
            throw new ExceptionConverter(de);
        }
    }

    @Override
    public void onCloseDocument(PdfWriter writer, Document document) {
        ColumnText.showTextAligned(total, Element.ALIGN_LEFT,
                new Phrase(String.valueOf(writer.getPageNumber() - 1), FontFactory.getFont("Times New Roman", 9)),
                0, 2, 0);
    }
}