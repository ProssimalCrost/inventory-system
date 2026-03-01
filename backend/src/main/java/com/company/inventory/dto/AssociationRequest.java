package com.company.inventory.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public class AssociationRequest {

    @NotNull(message = "Raw material ID is required")
    public Long rawMaterialId;

    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    public BigDecimal requiredQuantity;
}
