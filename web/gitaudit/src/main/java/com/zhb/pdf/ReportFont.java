package com.zhb.pdf;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.BaseFont;

import java.io.IOException;

/**
 * Created by zhouhaibin on 2016/11/22.
 */
public class ReportFont {
    static BaseFont baseFontMSYH;//微软雅黑
    static BaseFont baseFontHWFS;//华文仿宋
    static BaseFont baseFontHWXH;//华文细黑
    static {
        try {
            baseFontMSYH = BaseFont.createFont("C:/Windows/Fonts/MSYH.TTF",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
            baseFontHWFS = BaseFont.createFont("C:/Windows/Fonts/STFANGSO.TTF", BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
            baseFontHWXH = BaseFont.createFont("C:/Windows/Fonts/STXIHEI.TTF", BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
