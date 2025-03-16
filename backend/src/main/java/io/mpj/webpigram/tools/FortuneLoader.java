package io.mpj.webpigram.tools;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.db.postgres.Tables;
import io.mpj.webpigram.epigram.feeds.EpigramRepository;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "io.mpj.webpigram")
public class FortuneLoader {
  private static final Logger logger = LoggerFactory.getLogger(FortuneLoader.class);
  private static final String FORTUNES_DIR = "../Fortune-OSX/fortunes";
  private static final String RESOURCES_DIR = "src/main/resources/fortunes";
  private static final String AUTHOR_NAME = "fortune";

  public static void main(String[] args) {
    SpringApplication.run(FortuneLoader.class, args);
  }

  @Bean
  public CommandLineRunner loadData(EpigramRepository epigramRepository, DSLContext dsl) {
    return args -> {
      // Ensure resources directory exists
      Path resourcesPath = Paths.get(RESOURCES_DIR);
      if (!Files.exists(resourcesPath)) {
        Files.createDirectories(resourcesPath);
      }

      // Get all fortune files
      Map<String, String> fortunePairs = findFortunePairs();
      logger.info("Found {} fortune file pairs", fortunePairs.size());

      int totalFortunes = 0;
      int newFortunes = 0;
      int skippedFortunes = 0;

      // Process each fortune file
      for (Map.Entry<String, String> entry : fortunePairs.entrySet()) {
        String plainTextFile = entry.getKey();
        String datFile = entry.getValue();

        String topic = new File(plainTextFile).getName();
        logger.info("Processing fortune file: {}", topic);

        // Read fortunes from the file
        List<String> fortunes = readFortuneFile(plainTextFile);
        logger.info("Found {} fortunes in {}", fortunes.size(), topic);
        totalFortunes += fortunes.size();

        // Insert each fortune into the database
        for (String fortune : fortunes) {
          if (!fortune.trim().isEmpty()) {
            String trimmedFortune = fortune.trim();

            // Check if this fortune already exists in the database
            boolean exists = fortuneExists(dsl, trimmedFortune, AUTHOR_NAME, topic);

            if (!exists) {
              epigramRepository.createEpigram(trimmedFortune, AUTHOR_NAME, ImmutableList.of(topic));
              newFortunes++;
            } else {
              skippedFortunes++;
            }
          }
        }
      }

      logger.info("Fortune loading completed successfully");
      logger.info("Total fortunes processed: {}", totalFortunes);
      logger.info("New fortunes added: {}", newFortunes);
      logger.info("Skipped (already exist): {}", skippedFortunes);
    };
  }

  private boolean fortuneExists(DSLContext dsl, String content, String author, String topic) {
    // First check if the epigram with the same content and author exists
    int epigramCount =
        dsl.selectCount()
            .from(Tables.EPIGRAM)
            .where(Tables.EPIGRAM.CONTENT.eq(content))
            .and(Tables.EPIGRAM.AUTHOR.eq(author))
            .fetchOne(0, int.class);

    if (epigramCount == 0) {
      return false;
    }

    // If the epigram exists, check if it has the same topic
    // This is a more thorough check but might be overkill for most cases
    return dsl.select(Tables.EPIGRAM.ID)
        .from(Tables.EPIGRAM)
        .join(Tables.EPIGRAM_TOPIC)
        .on(Tables.EPIGRAM.ID.eq(Tables.EPIGRAM_TOPIC.EPIGRAM_ID))
        .where(Tables.EPIGRAM.CONTENT.eq(content))
        .and(Tables.EPIGRAM.AUTHOR.eq(author))
        .and(Tables.EPIGRAM_TOPIC.TOPIC.eq(topic))
        .fetch()
        .isNotEmpty();
  }

  private Map<String, String> findFortunePairs() {
    Map<String, String> pairs = new HashMap<>();
    File fortunesDir = new File(FORTUNES_DIR);

    if (!fortunesDir.exists() || !fortunesDir.isDirectory()) {
      logger.error("Fortunes directory not found: {}", FORTUNES_DIR);
      return pairs;
    }

    File[] files = fortunesDir.listFiles();
    if (files == null) {
      return pairs;
    }

    // Find all plain text files (those without .dat extension)
    for (File file : files) {
      if (file.isFile() && !file.getName().endsWith(".dat")) {
        // Check if corresponding .dat file exists
        File datFile = new File(fortunesDir, file.getName() + ".dat");
        if (datFile.exists()) {
          pairs.put(file.getAbsolutePath(), datFile.getAbsolutePath());
        }
      }
    }

    return pairs;
  }

  private List<String> readFortuneFile(String filePath) {
    List<String> fortunes = new ArrayList<>();
    StringBuilder currentFortune = new StringBuilder();

    try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
      String line;
      while ((line = reader.readLine()) != null) {
        // In fortune files, fortunes are separated by lines containing just "%"
        if (line.equals("%")) {
          if (currentFortune.length() > 0) {
            fortunes.add(currentFortune.toString().trim());
            currentFortune = new StringBuilder();
          }
        } else {
          currentFortune.append(line).append("\n");
        }
      }

      // Add the last fortune if there is one
      if (currentFortune.length() > 0) {
        fortunes.add(currentFortune.toString().trim());
      }
    } catch (IOException e) {
      logger.error("Error reading fortune file: {}", filePath, e);
    }

    return fortunes;
  }
}
