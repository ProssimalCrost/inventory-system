package com.company.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProductResourceIT {

    static Long createdId;

    @Test
    @Order(1)
    void shouldCreateProduct() {
        createdId = given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Test Product", "value": 99.99}
                """)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201)
            .body("name",  equalTo("Test Product"))
            .body("value", equalTo(99.99f))
            .extract().jsonPath().getLong("id");
    }

    @Test
    @Order(2)
    void shouldFindAllProducts() {
        given()
        .when()
            .get("/api/products")
        .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(1));
    }

    @Test
    @Order(3)
    void shouldFindProductById() {
        given()
        .when()
            .get("/api/products/" + createdId)
        .then()
            .statusCode(200)
            .body("id", equalTo(createdId.intValue()));
    }

    @Test
    @Order(4)
    void shouldUpdateProduct() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {"name": "Updated Product", "value": 150.00}
                """)
        .when()
            .put("/api/products/" + createdId)
        .then()
            .statusCode(200)
            .body("name",  equalTo("Updated Product"))
            .body("value", equalTo(150.00f));
    }

    @Test
    @Order(5)
    void shouldReturn404ForUnknownProduct() {
        given()
        .when()
            .get("/api/products/999999")
        .then()
            .statusCode(404);
    }

    @Test
    @Order(6)
    void shouldDeleteProduct() {
        given()
        .when()
            .delete("/api/products/" + createdId)
        .then()
            .statusCode(204);
    }
}
