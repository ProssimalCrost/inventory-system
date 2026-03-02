FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/quarkus-app ./quarkus-app
EXPOSE 8080
CMD ["java", "-jar", "quarkus-app/quarkus-run.jar"]
