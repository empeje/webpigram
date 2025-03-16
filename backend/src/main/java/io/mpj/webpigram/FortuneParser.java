package io.mpj.webpigram;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Random;

@SuppressWarnings("unused")
public class FortuneParser {
  // Structure matching the C STRFILE header
  private static class StrFileHeader {
    int version; // version number
    int numstr; // # of strings
    int longlen; // length of longest string
    int shortlen; // length of shortest string
    int flags; // bit field for flags
    char delim; // delimiting character

    static StrFileHeader readFromFile(RandomAccessFile file) throws IOException {
      StrFileHeader header = new StrFileHeader();
      byte[] buffer = new byte[24]; // Read the entire header at once

      // Read the full header
      file.readFully(buffer);

      ByteBuffer bb = ByteBuffer.wrap(buffer).order(ByteOrder.BIG_ENDIAN);

      header.version = bb.getInt();
      header.numstr = bb.getInt();
      header.longlen = bb.getInt();
      header.shortlen = bb.getInt();
      header.flags = bb.getInt();
      header.delim = '%'; // Fortune files use % as delimiter

      return header;
    }
  }

  public static String getFortune(String fortuneFile, String datFile) throws IOException {
    try (RandomAccessFile datRaf = new RandomAccessFile(datFile, "r")) {
      // Get dat file length
      long datFileLength = datRaf.length();

      // Read the header
      StrFileHeader header = StrFileHeader.readFromFile(datRaf);

      // Calculate maximum valid index based on actual file size
      long maxValidIndex = (datFileLength - 24) / 8; // (filesize - header) / pointer size

      // Generate random index within bounds
      Random random = new Random();
      int fortuneIndex = random.nextInt((int) Math.min(maxValidIndex, header.numstr));

      // Calculate the offset in the dat file for the fortune pointers
      long pointerOffset = 24 + (fortuneIndex * 8L);

      // Seek to the pointer location
      datRaf.seek(pointerOffset);

      // Read the start and end positions
      byte[] startBuffer = new byte[4];
      byte[] endBuffer = new byte[4];

      datRaf.readFully(startBuffer);
      datRaf.readFully(endBuffer);

      long startPos =
          Integer.toUnsignedLong(ByteBuffer.wrap(startBuffer).order(ByteOrder.BIG_ENDIAN).getInt());
      long endPos =
          Integer.toUnsignedLong(ByteBuffer.wrap(endBuffer).order(ByteOrder.BIG_ENDIAN).getInt());

      // Read the actual fortune from the text file
      try (RandomAccessFile fortuneRaf = new RandomAccessFile(fortuneFile, "r")) {
        long fortuneFileLength = fortuneRaf.length();

        // Ensure we don't read beyond the file
        endPos = Math.min(endPos, fortuneFileLength);
        if (startPos >= fortuneFileLength) {
          startPos = 0;
        }

        long length = endPos - startPos;
        byte[] fortuneBytes = new byte[(int) length];

        fortuneRaf.seek(startPos);
        fortuneRaf.readFully(fortuneBytes);

        String fortune = new String(fortuneBytes);

        // Handle ROT13 if the flag is set
        if (header.flags == 4) {
          fortune = rot13(fortune);
        }

        return fortune.trim();
      }
    }
  }

  private static String rot13(String input) {
    StringBuilder result = new StringBuilder();
    for (char c : input.toCharArray()) {
      if (Character.isLetter(c)) {
        char base = Character.isUpperCase(c) ? 'A' : 'a';
        result.append((char) (base + (c - base + 13) % 26));
      } else {
        result.append(c);
      }
    }
    return result.toString();
  }

  public static void main(String[] args) {
    // Update these paths to match your system
    String fortuneFile =
        "/Users/abdurrachmanmappuji/Development/webpigram/Fortune-OSX/fortunes/kids";
    String datFile =
        "/Users/abdurrachmanmappuji/Development/webpigram/Fortune-OSX/fortunes/kids.dat";

    try {
      String fortune = getFortune(fortuneFile, datFile);
      System.out.println(fortune);
    } catch (IOException e) {
      System.err.println("Error reading fortune: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
