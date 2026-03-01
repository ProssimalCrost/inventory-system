package com.company.inventory.service;

import com.company.inventory.dto.ProductionSuggestionDTO;
import com.company.inventory.entity.*;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProductionServiceTest {

    @Inject
    ProductionService productionService;

    @BeforeEach
    @Transactional
    void setup() {
        ProductRawMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();

        // Product A: value 200, needs 2 units of RM1
        Product pA = new Product();
        pA.name  = "Product A";
        pA.value = new BigDecimal("200.00");
        pA.persist();

        // Product B: value 50, needs 1 unit of RM1
        Product pB = new Product();
        pB.name  = "Product B";
        pB.value = new BigDecimal("50.00");
        pB.persist();

        RawMaterial rm1 = new RawMaterial();
        rm1.name          = "RM1";
        rm1.stockQuantity = new BigDecimal("5.000");
        rm1.persist();

        ProductRawMaterial prmA = new ProductRawMaterial();
        prmA.id               = new ProductRawMaterialId(pA.id, rm1.id);
        prmA.product          = pA;
        prmA.rawMaterial      = rm1;
        prmA.requiredQuantity = new BigDecimal("2.000");
        prmA.persist();

        ProductRawMaterial prmB = new ProductRawMaterial();
        prmB.id               = new ProductRawMaterialId(pB.id, rm1.id);
        prmB.product          = pB;
        prmB.rawMaterial      = rm1;
        prmB.requiredQuantity = new BigDecimal("1.000");
        prmB.persist();
    }

    @Test
    @Order(1)
    void shouldPrioritizeHigherValueProduct() {
        // RM1 stock = 5; Product A (value 200) needs 2 each → 2 units
        // Remaining stock = 5 - (2*2) = 1; Product B needs 1 → 1 unit
        ProductionSuggestionDTO result = productionService.getSuggestions();

        assertEquals(2, result.suggestions.size());

        ProductionSuggestionDTO.SuggestionItem first = result.suggestions.get(0);
        assertEquals("Product A", first.productName);
        assertEquals(2L, first.producibleQuantity);

        ProductionSuggestionDTO.SuggestionItem second = result.suggestions.get(1);
        assertEquals("Product B", second.productName);
        assertEquals(1L, second.producibleQuantity);

        // Total: 2*200 + 1*50 = 450
        assertEquals(0, result.totalValue.compareTo(new BigDecimal("450.00")));
    }

    @Test
    @Order(2)
    @Transactional
    void shouldReturnEmptyWhenNoStock() {
        RawMaterial.<RawMaterial>listAll()
                   .forEach(rm -> rm.stockQuantity = BigDecimal.ZERO);

        ProductionSuggestionDTO result = productionService.getSuggestions();
        assertTrue(result.suggestions.isEmpty());
        assertEquals(0, result.totalValue.compareTo(BigDecimal.ZERO));
    }
}
