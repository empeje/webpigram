# Fortune Loader

This tool loads fortune data from the Fortune-OSX repository into the Webpigram database.

## How it works

The `FortuneLoader` class:

1. Scans the Fortune-OSX/fortunes directory for pairs of fortune files (plain text file and corresponding .dat file)
2. Reads each fortune file and extracts individual fortunes (separated by % characters)
3. Checks if each fortune already exists in the database to prevent duplicates
4. Inserts only new fortunes into the database using the EpigramRepository
5. Uses the fortune file name as the topic for each epigram

## Usage

To run the fortune loader, use the following Maven command from the backend directory:

```bash
mvn spring-boot:run -P load-fortunes
```

This will:
1. Start the Spring Boot application with the FortuneLoader as the main class
2. Load all fortunes into the database, skipping any that already exist

If you need to run with a specific Spring profile (e.g., for database configuration), you can add:

```bash
mvn spring-boot:run -P load-fortunes -Dspring-boot.run.profiles=dev
```

## Notes

- The loader uses "fortune" as the author name for all epigrams
- Each fortune is tagged with the name of its source file as a topic
- The loader skips empty fortunes and duplicates
- The process may take a few minutes depending on the number of fortunes
- The loader provides a summary of total fortunes processed, new fortunes added, and duplicates skipped 