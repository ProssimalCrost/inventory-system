package com.company.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionDTO {

    public List<SuggestionItem> suggestions;
    public BigDecimal totalValue;

    public static class SuggestionItem {
        public Long productId;
        public String productName;
        public BigDecimal productValue;
        public long producibleQuantity;
        public BigDecimal subtotal;
    }
}
