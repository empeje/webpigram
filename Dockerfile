FROM eclipse-temurin:23-jdk-alpine

WORKDIR /app

# Copy the pre-built JAR file
COPY backend/target/*.jar app.jar
COPY . .
COPY Fortune-OSX Fortune-OSX

# Expose the port the app runs on
EXPOSE 8080

# Define the entry point with all required parameters
ENTRYPOINT ["java", "-Dspring-boot.run.profiles=prod", "-Dspring-boot.run.arguments=--app.fortune-loader.enabled=true", "-jar", "/app/app.jar", "--spring.profiles.active=prod"]