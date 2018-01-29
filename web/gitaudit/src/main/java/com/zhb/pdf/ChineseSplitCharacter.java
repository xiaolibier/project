package com.zhb.pdf;

import com.itextpdf.text.SplitCharacter;
import com.itextpdf.text.pdf.DefaultSplitCharacter;
import com.itextpdf.text.pdf.PdfChunk;


public class ChineseSplitCharacter implements SplitCharacter {

    // line of text cannot start or end with this character
    static final char u2060 = '\u2060';   //       - ZERO WIDTH NO BREAK SPACE

    // a line of text cannot start with any following characters in NOT_BEGIN_CHARACTERS[]
    static final char u30fb = '\u30fb';   //  ?   - KATAKANA MIDDLE DOT
    static final char u2022 = '\u2022';   //  ?    - BLACK SMALL CIRCLE (BULLET)
    static final char uff65 = '\uff65';   //  ?    - HALFWIDTH KATAKANA MIDDLE DOT
    static final char u300d = '\u300d';   //  」   - RIGHT CORNER BRACKET
    static final char uff09 = '\uff09';   //  ）   - FULLWIDTH RIGHT PARENTHESIS
    static final char u0021 = '\u0021';   //  !    - EXCLAMATION MARK
    static final char u0025 = '\u0025';   //  %    - PERCENT SIGN
    static final char u0029 = '\u0029';   //  )    - RIGHT PARENTHESIS
    static final char u002c = '\u002c';   //  ,    - COMMA
    static final char u002e = '\u002e';   //  .    - FULL STOP
    static final char u003f = '\u003f';   //  ?    - QUESTION MARK
    static final char u005d = '\u005d';   //  ]    - RIGHT SQUARE BRACKET
    static final char u007d = '\u007d';   //  }    - RIGHT CURLY BRACKET
    static final char uff61 = '\uff61';   //  ?    - HALFWIDTH IDEOGRAPHIC FULL STOP

    static final char uff70 = '\uff70';   //  ?    - HALFWIDTH KATAKANA-HIRAGANA PROLONGED SOUND MARK
    static final char uff9e = '\uff9e';   //  ?    - HALFWIDTH KATAKANA VOICED SOUND MARK
    static final char uff9f = '\uff9f';   //  ?    - HALFWIDTH KATAKANA SEMI-VOICED SOUND MARK
    static final char u3001 = '\u3001';   //  、    - IDEOGRAPHIC COMMA
    static final char u3002 = '\u3002';   //  。    - IDEOGRAPHIC FULL STOP
    static final char uff0c = '\uff0c';   //  ，    - FULLWIDTH COMMA
    static final char uff0e = '\uff0e';   //  ．    - FULLWIDTH FULL STOP
    static final char uff1a = '\uff1a';   //  ：    - FULLWIDTH COLON
    static final char uff1b = '\uff1b';   //  ；    - FULLWIDTH SEMICOLON
    static final char uff1f = '\uff1f';   //  ？    - FULLWIDTH QUESTION MARK
    static final char uff01 = '\uff01';   //  ！    - FULLWIDTH EXCLAMATION MARK
    static final char u309b = '\u309b';   //  ゛    - KATAKANA-HIRAGANA VOICED SOUND MARK
    static final char u309c = '\u309c';   //  ゜    - KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
    static final char u30fd = '\u30fd';   //  ヽ    - KATAKANA ITERATION MARK

    static final char u2019 = '\u2019';   //  ’    - RIGHT SINGLE QUOTATION MARK
    static final char u201d = '\u201d';   //  ”    - RIGHT DOUBLE QUOTATION MARK
    static final char u3015 = '\u3015';   //  〕    - RIGHT TORTOISE SHELL BRACKET
    static final char uff3d = '\uff3d';   //  ］    - FULLWIDTH RIGHT SQUARE BRACKET
    static final char uff5d = '\uff5d';   //  ｝    - FULLWIDTH RIGHT CURLY BRACKET
    static final char u3009 = '\u3009';   //  〉    - RIGHT ANGLE BRACKET
    static final char u300b = '\u300b';   //  》    - RIGHT DOUBLE ANGLE BRACKET
    static final char u300f = '\u300f';   //  』    - RIGHT WHITE CORNER BRACKET
    static final char u3011 = '\u3011';   //  】    - RIGHT BLACK LENTICULAR BRACKET
    static final char u00b0 = '\u00b0';   //  °    - DEGREE SIGN
    static final char u2032 = '\u2032';   //  ′    - PRIME
    static final char u2033 = '\u2033';   //  ″    - DOUBLE PRIME


    static final char[] NOT_BEGIN_CHARACTERS = new char[]{u30fb, u2022, uff65, u300d, uff09, u0021, u0025, u0029, u002c,
            u002e, u003f, u005d, u007d, uff61,
            uff70, uff9e, uff9f, u3001, u3002, uff0c, uff0e, uff1a, uff1b, uff1f, uff01, u309b, u309c, u30fd,
            u2019, u201d, u3015, uff3d, uff5d, u3009, u300b, u300f, u3011, u00b0,
            u2032, u2033, u2060};

    // a line of text cannot end with any following characters in NOT_ENDING_CHARACTERS[]
    static final char u0024 = '\u0024';   //  $   - DOLLAR SIGN
    static final char u0028 = '\u0028';   //  (   - LEFT PARENTHESIS
    static final char u005b = '\u005b';   //  [   - LEFT SQUARE BRACKET
    static final char u007b = '\u007b';   //  {   - LEFT CURLY BRACKET
    static final char u00a3 = '\u00a3';   //  £   - POUND SIGN
    static final char u00a5 = '\u00a5';   //  ¥   - YEN SIGN
    static final char u201c = '\u201c';   //  “   - LEFT DOUBLE QUOTATION MARK
    static final char u2018 = '\u2018';   //   ‘  - LEFT SINGLE QUOTATION MARK
    static final char u300a = '\u300a';   //  《  - LEFT DOUBLE ANGLE BRACKET
    static final char u3008 = '\u3008';   //  〈  - LEFT ANGLE BRACKET
    static final char u300c = '\u300c';   //  「  - LEFT CORNER BRACKET
    static final char u300e = '\u300e';   //  『  - LEFT WHITE CORNER BRACKET
    static final char u3010 = '\u3010';   //  【  - LEFT BLACK LENTICULAR BRACKET
    static final char u3014 = '\u3014';   //  〔  - LEFT TORTOISE SHELL BRACKET
    static final char uff62 = '\uff62';   //  ?   - HALFWIDTH LEFT CORNER BRACKET
    static final char uff08 = '\uff08';   //  （  - FULLWIDTH LEFT PARENTHESIS
    static final char uff3b = '\uff3b';   //  ［  - FULLWIDTH LEFT SQUARE BRACKET
    static final char uff5b = '\uff5b';   //  ｛  - FULLWIDTH LEFT CURLY BRACKET
    static final char uffe5 = '\uffe5';   //  ￥  - FULLWIDTH YEN SIGN
    static final char uff04 = '\uff04';   //  ＄  - FULLWIDTH DOLLAR SIGN

    static final char[] NOT_ENDING_CHARACTERS = new char[]{u0024, u0028, u005b, u007b, u00a3, u00a5, u201c, u2018, u3008,
            u300a, u300c, u300e, u3010, u3014, uff62, uff08, uff3b, uff5b, uffe5, uff04, u2060};

    /**
     * An instance of the jpSplitCharacter.
     */
    public static final ChineseSplitCharacter splitCharacter = new ChineseSplitCharacter();

    /**
     * An instance DefaultSplitCharacter used for BasicLatin characters.
     */
    private static final SplitCharacter defaultSplitCharacter = new DefaultSplitCharacter();

    public ChineseSplitCharacter() {
    }

    /**
     * Custom method to for SplitCharacter to handle Japanese characters.
     * Returns <CODE>true</CODE> if the character can split a line. The splitting implementation
     * is free to look ahead or look behind characters to make a decision.
     *
     * @param start   the lower limit of <CODE>cc</CODE> inclusive
     * @param current the pointer to the character in <CODE>cc</CODE>
     * @param end     the upper limit of <CODE>cc</CODE> exclusive
     * @param cc      an array of characters at least <CODE>end</CODE> sized
     * @param ck      an array of <CODE>PdfChunk</CODE>. The main use is to be able to call
     *                {@link PdfChunk#getUnicodeEquivalent(int)}. It may be <CODE>null</CODE>
     *                or shorter than <CODE>end</CODE>. If <CODE>null</CODE> no conversion takes place.
     *                If shorter than <CODE>end</CODE> the last element is used
     * @return <CODE>true</CODE> if the character(s) can split a line
     */
    public boolean isSplitCharacter(int start, int current, int end, char[] cc, PdfChunk[] ck) {

        // Note: If you don't add an try/catch and there is an issue with isSplitCharacter(), iText silently fails and
        // you have no idea there was a problem.
        try {

            char charCurrent = getCharacter(current, cc, ck);

            int next = current + 1;
            if (next < cc.length) {
                char charNext = getCharacter(next, cc, ck);
                for (char not_begin_character : NOT_BEGIN_CHARACTERS) {
                    if (charNext == not_begin_character) {
                        return false;
                    }
                }
            }

            for (char not_ending_character : NOT_ENDING_CHARACTERS) {
                if (charCurrent == not_ending_character) {
                    return false;
                }
            }

            boolean isBasicLatin = Character.UnicodeBlock.of(charCurrent) == Character.UnicodeBlock.BASIC_LATIN;
            if (isBasicLatin)
                return defaultSplitCharacter.isSplitCharacter(start, current, end, cc, ck);

            return true;

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return true;
    }

    /**
     * Returns a character int the array (Note: modified from the iText default version with the addition null
     * check of '|| ck[Math.min(position, ck.length - 1)] == null'.
     *
     * @param position position in the array
     * @param ck       chunk array
     * @param cc       the character array that has to be checked
     * @return the character
     */
    protected char getCharacter(int position, char[] cc, PdfChunk[] ck) {
        if (ck == null || ck[Math.min(position, ck.length - 1)] == null) {
            return cc[position];
        }
        return (char) ck[Math.min(position, ck.length - 1)].getUnicodeEquivalent(cc[position]);
    }

}