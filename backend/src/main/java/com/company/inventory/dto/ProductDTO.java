package com.company.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

// ── Product ──────────────────────────────────────────────────

public class ProductDTO {

    public Long id;

    @NotBlank(message = "Name is required")
    public String name;

    @NotNull(message = "Value is required")
    @PositiveOrZero
    public BigDecimal value;

    public List<ProductRawMaterialDTO> rawMaterials;

    // ── Inner DTO for raw material association ──
    public static class ProductRawMaterialDTO {
        public Long rawMaterialId;
        public String rawMaterialName;
        public BigDecimal requiredQuantity;
    }
}
