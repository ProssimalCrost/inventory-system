package com.company.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class RawMaterialDTO {

    public Long id;

    @NotBlank(message = "Name is required")
    public String name;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero
    public BigDecimal stockQuantity;
}
