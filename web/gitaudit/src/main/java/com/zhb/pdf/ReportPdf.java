package com.zhb.pdf;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.zhb.bean.Discovery;
import com.zhb.bean.LimitedWord;
import com.zhb.bean.MainCategory;
import com.zhb.core.ObjectBase;
import com.zhb.manager.MemoryCache;
import com.zhb.view.*;

import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * Created by zhouhaibin on 2016/11/22.
 */
public class ReportPdf {
    Document document;
    PdfWriter writer;

    public void createReportPdf(ReportView reportView, String pdfFileName) throws Exception {
        document = new Document(PageSize.A4, 79, 74, 105, 99);
        writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFileName));
        createCenterReportPdf(reportView);
    }

    public void createReportPdf(ReportView reportView, OutputStream outputStream) throws Exception {
        document = new Document(PageSize.A4, 79, 74, 105, 99);
        writer = PdfWriter.getInstance(document, outputStream);
        createCenterReportPdf(reportView);
    }

    private void createCenterReportPdf(ReportView reportView) throws Exception {
        ReportHeaderFooter header = new ReportHeaderFooter();
        header.setReportId(reportView.getId());
        writer.setPageEvent(header);
        document.open();
        document.newPage();
        addEmptyLine(6, 12);
        if (reportView.isCenterReport()) {
            addCenterTitle("稽 查 报 告", new Font(ReportFont.baseFontHWXH, 26, Font.BOLD));
            addCenterTitle("AUDIT REPORT", FontFactory.getFont("Times New Roman", 24, Font.BOLD));
        } else {
            addCenterTitle("稽 查 汇 总 报 告", new Font(ReportFont.baseFontHWXH, 26, Font.BOLD));
            addCenterTitle("AUDIT SUMMARY REPORT", FontFactory.getFont("Times New Roman", 24, Font.BOLD));
        }
        addEmptyLine(1, 15);

        addCenterTitle("项目编号:" + reportView.getProjectId(), new Font(ReportFont.baseFontHWFS, 15, Font.BOLD));;
        addEmptyLine(9, 12);

        addParagraph("法律声明", new Font(ReportFont.baseFontHWFS, 12));
        addParagraph("1. 报告中相关信息涉及商业机密，非法律要求，不得泄露；", new Font(ReportFont.baseFontHWFS, 12));
        addParagraph("2. 报告仅供注册申请机构参考使用；", new Font(ReportFont.baseFontHWFS, 12));
        addParagraph("3. 报告中的信息，仅对本稽查时点和稽查范围的检查发现负责；", new Font(ReportFont.baseFontHWFS, 12));
        addParagraph("4. 报告版权及最终解释权归北京经纬传奇医药科技有限公司所有。 ", new Font(ReportFont.baseFontHWFS, 12));
        document.newPage();

        addEmptyLine(1, 14);
        addCenterTitle("第一部分：稽查目的、范围、依据", new Font(ReportFont.baseFontHWXH, 16));
        addEmptyLine(1, 16);
        addIndentParagraph("一、稽查目的 ", new Font(ReportFont.baseFontHWXH, 14));
        addIndentParagraph(reportView.getPurpose(), new Font(ReportFont.baseFontHWFS, 12));
        addEmptyLine(1, 14);

        addIndentParagraph("二、稽查范围 ", new Font(ReportFont.baseFontHWXH, 14));
        addIndentParagraph(reportView.getRange(), new Font(ReportFont.baseFontHWFS, 12));
        addEmptyLine(1, 14);

        addIndentParagraph("三、稽查依据 ", new Font(ReportFont.baseFontHWXH, 14));
        addIndentParagraph(reportView.getFoundation(), new Font(ReportFont.baseFontHWFS, 12));
        addEmptyLine(1, 14);

        document.newPage();

        addCenterTitle("第二部分：稽查内容", new Font(ReportFont.baseFontHWXH, 16));
        addIndentParagraph("一、稽查概要 ", new Font(ReportFont.baseFontHWXH, 14));
        addIndentParagraph(reportView.getOverview(), new Font(ReportFont.baseFontHWFS, 12));
        addEmptyLine(1, 14);

//        String temp = String.format("稽查中共发现严重问题%d个，主要问题%d个，一般问题%d个，见《稽查发现问题统计表》。其中，XXX方面的问题较为突出，建议加强监督管理。",
//                reportView.getCountByLevel("严重问题"), reportView.getCountByLevel("主要问题"), reportView.getCountByLevel("一般问题"));
//        addIndentParagraph(temp, new Font(ReportFont.baseFontHWFS, 12));

        addCenterTitle("稽查发现问题统计 ", new Font(ReportFont.baseFontHWXH, 14, Font.BOLD));

        addEmptyLine(1, 14);
        addDiscoveryCountTable(reportView);
        addParagraph("（备注：严重、主要、一般问题定义见附录1）", new Font(ReportFont.baseFontHWFS, (float)10.5));
        document.newPage();

        addCenterTitle("第三部分：稽查发现 ", new Font(ReportFont.baseFontHWXH, 16));
        addEmptyLine(1, 16);
        String[] hanziNumbers = {"一", "二", "三"};
        for (int i = 0; i < reportView.getLevelViews().size(); i ++) {
            DiscoveryLevelView levelView = reportView.getLevelViews().get(i);
            String title = hanziNumbers[i] + "、" + levelView.getLevel();
            addIndentParagraph(title, new Font(ReportFont.baseFontHWXH, 14));
            addLevelList(levelView, reportView);
            addEmptyLine(1, 14);
        }

        addEmptyLine(5, 14);
        if (reportView.isCenterReport())
            addRightParagraph("稽查组长：                                         ", new Font(ReportFont.baseFontHWFS, 14));
        else
            addRightParagraph("稽查经理：                                         ", new Font(ReportFont.baseFontHWFS, 14));
        addRightParagraph("签字日期：                                         ", new Font(ReportFont.baseFontHWFS, 14));

        document.newPage();

        //附录
        addParagraph("附录1：", new Font(ReportFont.baseFontHWXH, 16));
        addEmptyLine(1, 15);
        addCenterTitle("稽查发现问题程度分级", new Font(ReportFont.baseFontHWXH, 15, Font.BOLD));
        addEmptyLine(1, 12);
        Paragraph paragraph = new Paragraph(25);
        paragraph.add(new Chunk("严重问题（Critical finding）", new Font(ReportFont.baseFontHWFS, 12, Font.BOLD)));
        Chunk chunk = new Chunk("– 发现的问题严重偏离/触犯了相应的法规和GCP，严重影响数据的真实完整、受试者的安全、隐私和权益；该问题的发生显示存在系统性的违规。该问题完全不能被接受，可能导致研究中心的关闭，并影响试验产品的最后批准。如：涉及造假、数据伪造、数据的可靠性差或缺乏源文件/记录、既往的严重问题或主要问题未采取及时的纠正措施、一系列典型同一类型的主要问题、（任何需要向卫生监管部门报告或通知的）多个不依从频繁/有趋势成为频繁的未报告/延迟报告等。 ", new Font(ReportFont.baseFontHWFS, 12));
        chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
        paragraph.add(chunk);
        paragraph.setFirstLineIndent(25);
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        document.add(paragraph);

        paragraph = new Paragraph(25);
        paragraph.add(new Chunk("主要问题（Major finding）", new Font(ReportFont.baseFontHWFS, 12, Font.BOLD)));
        chunk = new Chunk("– 发现的问题偏离/触犯了相应的法规和GCP，可能影响受试者的安全，隐私和权益；数据质量受到影响，但不影响数据的真实完整；该问题的发生可能源于系统性的违规，如不及时有效解决，具有较高风险发展成严重问题。可能需要采取正式的改进措施和书面记录，研究中心的操作需要改进。如：跨职能领域依从性差，但没有造成系统管理的质量问题、（任何需要向卫生监管部门报告或通知的）单个不依从未报告或延迟报告。", new Font(ReportFont.baseFontHWFS, 12));
        chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
        paragraph.add(chunk);
        paragraph.setFirstLineIndent(25);
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        document.add(paragraph);

        paragraph = new Paragraph(25);
        paragraph.add(new Chunk("一般问题（Minor finding）", new Font(ReportFont.baseFontHWFS, 12, Font.BOLD)));
        chunk = new Chunk("– 发现的问题与相应的法规和GCP规定偏移，尚未对流程、临床试验数据或系统造成后续的影响；一般不会影响受试者的安全，隐私和权益、数据的真实完整，但有进一步完善和提高的需要。建议对研究中心培训或完善研究中心操作方式。同一类型的一般问题频繁发生，可能提示研究中心对GCP的理解和依从存在问题，可能造成问题程度的加重。", new Font(ReportFont.baseFontHWFS, 12));
        chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
        paragraph.add(chunk);
        paragraph.setFirstLineIndent(25);
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        document.add(paragraph);

        document.close();
    }

    private void addLevelList(DiscoveryLevelView levelView, ReportView reportView) throws DocumentException {
        List listProblem = new List(List.ORDERED);
        listProblem.setFirst(1);
        listProblem.setIndentationLeft(25);

        for (int i = 0; i < levelView.getProblemViews().size(); i ++) {
            DiscoveryProblemView problemView = levelView.getProblemViews().get(i);
            addListItem(listProblem, problemView.getProblemName(), new Font(ReportFont.baseFontHWFS, 12, Font.BOLD));
            List listPatient = new List(List.ORDERED);
            listPatient.setFirst(1);
            listPatient.setPostSymbol("）");
            //lastJ = 1;
            for (int j = 0; j < problemView.getPatientViews().size(); j++) {
                DiscoveryPatientView patientView = problemView.getPatientViews().get(j);
                if (patientView.getDiscoveryViews().size() == 1) {
                    Discovery discovery = patientView.getDiscoveryViews().get(0);
                    String description = discovery.getDescription();
                    if (!patientView.getPatientNo().equals(ObjectBase.EMPTY_OBJECT)) {
                        description = "受试者" + patientView.getPatientNo() + ": " + description;
                    }
                    if (!reportView.isCenterReport()) {//阶段报告需要显示中心名称
                        description = description + "（" + discovery.getCenterCode() + "中心）";
                    }
//                    List listDescriptionItem = new List(List.ORDERED);
//                    listDescriptionItem.setPostSymbol("）");
//                    listDescriptionItem.setFirst(lastJ++);
//                    addListItem(listDescriptionItem, description, new Font(ReportFont.baseFontHWFS, 12));
                    description = description.trim();
                    if (description.equals("")) continue;
                    description = correctPunctuation(description);
                    if (j == problemView.getPatientViews().size() - 1)
                        description += "。";
                    else description += "；";
                    addListItem(listPatient, description, new Font(ReportFont.baseFontHWFS, 12));

                    //listPatient.add(listDescriptionItem);
                } else {
                    if (patientView.getPatientNo().equals(ObjectBase.EMPTY_OBJECT)) {
//                        addListItem(listPatient, "受试者" + patientView.getPatientNo() + ": ", new Font(ReportFont.baseFontHWFS, 12));
//                        List listDescription = new List(List.ORDERED, List.ALPHABETICAL);
//                        listDescription.setFirst(1);
//                        listDescription.setLowercase(List.LOWERCASE);
//                        listDescription.setPostSymbol("）");
//                        listDescription.setIndentationLeft(25);
                        for (int k = 0; k < patientView.getDiscoveryViews().size(); k ++) {
                            Discovery discovery = patientView.getDiscoveryViews().get(k);
//                            String description = "受试者" + patientView.getPatientNo() + ": " + discovery.getDescription();
                            String description = discovery.getDescription();
                            if (!reportView.isCenterReport()) {//阶段报告需要显示中心名称
                                description = description + "（" + discovery.getCenterCode() + "中心）";
                            }
//                            List listDescriptionItem = new List(List.ORDERED);
//                            listDescriptionItem.setPostSymbol("）");
//                            listDescriptionItem.setFirst(lastJ++);
//                            addListItem(listDescriptionItem, description, new Font(ReportFont.baseFontHWFS, 12));
//                            listPatient.add(listDescriptionItem);
                            description = description.trim();
                            if (description.equals("")) continue;
                            description = correctPunctuation(description);
                            if (k == patientView.getDiscoveryViews().size() - 1)
                                description += "。";
                            else description += "；";
                            addListItem(listPatient, description, new Font(ReportFont.baseFontHWFS, 12));


//                            List listDescriptionItem = new List(List.ORDERED, List.ALPHABETICAL);
//                            listDescriptionItem.setFirst(k + 1);
//                            listDescriptionItem.setLowercase(List.LOWERCASE);
//                            listDescriptionItem.setPostSymbol("）");
//                            String description = discovery.getDescription();
//                            if (!reportView.isCenterReport()) {//阶段报告需要显示中心名称
//                                description = description + "（" + discovery.getCenterCode() + "中心）";
//                            }
//                            addListItem(listDescriptionItem, description, new Font(ReportFont.baseFontHWFS, 12));
//                            listDescription.add(listDescriptionItem);
                        }
//                        listPatient.add(listDescription);
                    } else {
                        List listDescription = new List(List.ORDERED/*, List.ALPHABETICAL*/);
                        //listDescription.setFirst(lastJ++);
//                        listDescription.setLowercase(List.LOWERCASE);
//                        listDescription.setPostSymbol("）");
                        listDescription.setIndentationLeft(25);
                        for (int k = 0; k < patientView.getDiscoveryViews().size(); k ++) {
                            Discovery discovery = patientView.getDiscoveryViews().get(k);
                            List listDescriptionItem = new List(List.ORDERED, List.ALPHABETICAL);
                            listDescriptionItem.setFirst(k + 1);
                            listDescriptionItem.setLowercase(List.LOWERCASE);
                            listDescriptionItem.setPostSymbol("）");
                            String description = discovery.getDescription();
                            description = description.trim();
                            if (description.equals("")) continue;
                            description = correctPunctuation(description);
                            if (k == patientView.getDiscoveryViews().size() - 1)
                                description += "。";
                            else description += "；";
                            if (!reportView.isCenterReport()) {//阶段报告需要显示中心名称
                                description = description + "（" + discovery.getCenterCode() + "中心）";
                            }
                            addListItem(listDescriptionItem, description, new Font(ReportFont.baseFontHWFS, 12));
                            listDescription.add(listDescriptionItem);
                        }
                        addListItem(listPatient, "受试者" + patientView.getPatientNo() + ": ", new Font(ReportFont.baseFontHWFS, 12));
                        listPatient.add(listDescription);
                    }
                }

            }
            listProblem.add(listPatient);
            addCategoryAndReference(listProblem, problemView);
        }
        document.add(listProblem);
    }

    private String correctPunctuation(String str) {
        String res;
        String lastChar = str.substring(str.length() - 1);
        if (lastChar.equals("，") ||
                lastChar.equals("。") ||
                lastChar.equals("；") ||
                lastChar.equals("：") ||
                lastChar.equals("！") ||
                lastChar.equals("……") ||
                lastChar.equals("？") ||
                lastChar.equals(".") ||
                lastChar.equals(":") ||
                lastChar.equals(";") ||
                lastChar.equals("!") ||
                lastChar.equals("...") ||
                lastChar.equals("?") ||
                lastChar.equals(","))
            res = str.substring(0, str.length() - 1);
        else res = str;
        return res;
    }

    private void addCategoryAndReference(List list, DiscoveryProblemView problemView) {
        List listCategory = new List(List.ORDERED);
        ListItem listItem = new ListItem(25, "分类：" + problemView.getCategory(), new Font(ReportFont.baseFontHWFS, 12));
        listItem.setListSymbol(new Chunk(""));
        listCategory.add(listItem);
        if (problemView.getReferences().size() == 0) {
            listItem = new ListItem(25, "依据：", new Font(ReportFont.baseFontHWFS, 12));
            listItem.setListSymbol(new Chunk(""));
            listCategory.add(listItem);
        } else {
            for (int j = 0; j < problemView.getReferences().size(); j++) {
                DiscoveryReferenceView referenceView = problemView.getReferences().get(j);
                String text = referenceView.getName();
                if (j == 0) {
                    text = "依据：" + text;
                } else {
                    text = "            " + text;
                }
                Chunk chunk = new Chunk(text, new Font(ReportFont.baseFontHWFS, 12));
                chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
                listItem = new ListItem(25, chunk);
                listItem.setAlignment(Element.ALIGN_JUSTIFIED);
                listItem.setListSymbol(new Chunk(""));
                listCategory.add(listItem);
            }
        }
        list.add(listCategory);
    }

    private void addListItem(List list, String text, Font font) {
        text = text.replaceAll("&lt;", "<");
        Chunk chunk = new Chunk(text, font);
        chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
        ListItem listItem = new ListItem(25, chunk);
        listItem.setAlignment(Element.ALIGN_JUSTIFIED);
        list.add(listItem);
    }

    private void addParagraph(String text, Font font) throws DocumentException {
        Chunk chunk = new Chunk(text, font);
        chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
        Paragraph paragraph = new Paragraph(chunk);
        paragraph.setLeading(25);
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        document.add(paragraph);
    }

    private void addIndentParagraph(String text, Font font) throws DocumentException {
        if (text == null)
            return;
        String[] lines = text.split("\n");
        for (String line : lines) {
            Chunk chunk = new Chunk(line, font);
            chunk.setSplitCharacter(ChineseSplitCharacter.splitCharacter);
            Paragraph paragraph = new Paragraph(chunk);
            paragraph.setLeading(25);
            paragraph.setFirstLineIndent(25);
            paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(paragraph);
        }
    }

    private void addRightParagraph(String text, Font font) throws DocumentException {
        Paragraph paragraph = new Paragraph(text, font);
        paragraph.setLeading(25);
        paragraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(paragraph);
    }

    private void addEmptyLine(int lines, float fontSize) throws Exception {
        Paragraph emptyLine = new Paragraph(" ", new Font(ReportFont.baseFontHWFS, fontSize));
        emptyLine.setLeading(25);
        for (int i = 0; i < lines; i ++)
            document.add(emptyLine);
    }

    private void addCenterTitle(String title, Font font) throws DocumentException {
        Paragraph paragraph = new Paragraph(title, font);
        paragraph.setLeading(25);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        document.add(paragraph);
    }

    public PdfPCell createCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private void addDiscoveryCountTable(ReportView reportView) throws DocumentException {
        PdfPTable table;
        if (reportView.isCenterReport()) {
            table = new PdfPTable(5);
            table.setWidths(new int[]{85, 250, 35, 35, 35});
        } else {
            table = new PdfPTable(6);
            table.setWidths(new int[]{70, 210, 35, 35, 35, 55});
        }
        table.setTotalWidth(document.right() - document.left());
        table.setLockedWidth(true);
//        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font font = new Font(ReportFont.baseFontHWXH, 12, Font.BOLD);
        PdfPCell cell = createCell("类别", font);
        cell.setRowspan(2);
        table.addCell(cell);

        cell = createCell("子类", font);
        cell.setRowspan(2);
        table.addCell(cell);

        cell = createCell("发现分级", font);
        cell.setColspan(3);
        cell.setFixedHeight(20);
        table.addCell(cell);

        if (!reportView.isCenterReport()) {
            cell = createCell("机构类型", font);
            cell.setRowspan(2);
            table.addCell(cell);
        }

        LimitedWord levels = (LimitedWord)MemoryCache.getObject(LimitedWord.class, LimitedWord.ID_DISCOVERY_LEVEL);
        for (String level : levels.getWords()) {
            cell = createCell(level, font);
            cell.setFixedHeight(40);
            table.addCell(cell);
        }

        font = new Font(ReportFont.baseFontHWFS, (float)10.5);
        java.util.List mainCategories = MemoryCache.getMainCategories();
        for (int i = 0; i < mainCategories.size(); i ++) {
            MainCategory mainCategory = (MainCategory)mainCategories.get(i);
            cell = createCell(mainCategory.getName(), font);
            cell.setRowspan(mainCategory.getCategoryIds().size());
            cell.setFixedHeight(25);
            table.addCell(cell);
            for (int j = 0; j < mainCategory.getCategoryIds().size(); j ++) {
                String categoryName = mainCategory.getCategoryNames().get(j);
                String categoryId = mainCategory.getCategoryIds().get(j);
                cell = createCell(categoryName, font);
                cell.setFixedHeight(25);
                table.addCell(cell);

                CategoryLevelCount categoryLevelCount = reportView.getCategoryLevelCountMap().get(categoryId);
                for (String level : levels.getWords()) {
                    String count = getCategoryLevelCount(categoryLevelCount, level);
                    cell = createCell(String.valueOf(count), font);
                    cell.setFixedHeight(20);
                    table.addCell(cell);
                }

                if (!reportView.isCenterReport()) {
                    cell = createCell(getCategoryLevelCenterType(categoryLevelCount), font);
                    cell.setFixedHeight(20);
                    table.addCell(cell);
                }
            }
        }

        document.add(table);
    }

    private String getCategoryLevelCount(CategoryLevelCount categoryLevelCount, String level) {
        if (categoryLevelCount == null)
            return "/";
        Integer count = categoryLevelCount.getLevelCountMap().get(level);
        if (count == null)
            return "/";
        return String.valueOf(count);
    }

    private String getCategoryLevelCenterType(CategoryLevelCount categoryLevelCount) {
        if (categoryLevelCount == null)
            return "";
        return categoryLevelCount.getCenterType();
    }

    public static void main(String []args) {
        ReportPdf reportPdf = new ReportPdf();
        try {
            reportPdf.createReportPdf(null, "C:\\testHeaderAndFooter.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
