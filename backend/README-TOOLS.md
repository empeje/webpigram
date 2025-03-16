# Code Quality Tools

This project uses several Maven plugins to ensure code quality and consistency:

## SortPOM Plugin

The SortPOM plugin sorts and verifies the structure of the `pom.xml` file.

### Usage

To sort the POM file:
```bash
mvn sortpom:sort
```

To verify the POM file structure without making changes:
```bash
mvn sortpom:verify
```

## Checkstyle

Checkstyle is used to enforce coding standards based on a customized version of Google's Java Style Guide.

### Usage

To run checkstyle validation:
```bash
mvn checkstyle:check
```

The checkstyle configuration is defined in `checkstyle.xml` in the project root.

## Spotify Java Formatter

The Spotify Java Formatter (fmt-maven-plugin) automatically formats Java code according to Google's Java Style Guide.

### Usage

To format all Java files:
```bash
mvn fmt:format
```

To check if files are formatted correctly without making changes:
```bash
mvn fmt:check
```

## Running All Tools

You can run all tools as part of the build process:

```bash
mvn clean verify
```

This will:
1. Sort the POM file
2. Check code style with Checkstyle
3. Format Java code with Spotify formatter
4. Compile and build the project

## IDE Integration

For the best development experience, consider configuring your IDE to use these tools:

### IntelliJ IDEA
- Install the CheckStyle-IDEA plugin
- Configure it to use the project's `checkstyle.xml`
- Set up a file watcher for the Spotify formatter

### Eclipse
- Install the Checkstyle plugin
- Configure it to use the project's `checkstyle.xml`
- Set up external tools for the Spotify formatter

### VS Code
- Install the Checkstyle for Java extension
- Configure it to use the project's `checkstyle.xml`
- Set up tasks for the Spotify formatter 