package com.company.inventory.service;

import com.company.inventory.dto.ProductionSuggestionDTO;
import com.company.inventory.entity.Product;
import com.company.inventory.entity.ProductRawMaterial;
import com.company.inventory.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {

    /**
     * Calculates production suggestions using a greedy algorithm.
     * Products are prioritized by descending value.
     * Stock is consumed as each product is allocated.
     */
    public ProductionSuggestionDTO getSuggestions() {

        // 1. Load all products ordered by value DESC (priority)
        List<Product> products = Product.findAllOrderByValueDesc();

        // 2. Load current stock into a mutable map: rawMaterialId → availableQty
        Map<Long, BigDecimal> availableStock = new HashMap<>();
        RawMaterial.<RawMaterial>listAll()
                   .forEach(rm -> availableStock.put(rm.id, rm.stockQuantity));

        List<ProductionSuggestionDTO.SuggestionItem> suggestions = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        // 3. For each product (highest value first), calculate max producible qty
        for (Product product : products) {
            if (product.rawMaterials.isEmpty()) continue;

            long producibleQty = Long.MAX_VALUE;

            for (ProductRawMaterial prm : product.rawMaterials) {
                BigDecimal stock    = availableStock.getOrDefault(prm.rawMaterial.id, BigDecimal.ZERO);
                BigDecimal required = prm.requiredQuantity;

                if (required.compareTo(BigDecimal.ZERO) == 0) continue;

                long canProduce = stock.divide(required, 0, RoundingMode.FLOOR).longValue();
                producibleQty   = Math.min(producibleQty, canProduce);
            }

            if (producibleQty == Long.MAX_VALUE) producibleQty = 0;

            if (producibleQty > 0) {
                // 4. Deduct stock consumed by this product
                for (ProductRawMaterial prm : product.rawMaterials) {
                    BigDecimal consumed = prm.requiredQuantity
                            .multiply(BigDecimal.valueOf(producibleQty));
                    availableStock.merge(prm.rawMaterial.id, consumed,
                            (current, c) -> current.subtract(c));
                }

                BigDecimal subtotal = product.value.multiply(BigDecimal.valueOf(producibleQty));
                totalValue = totalValue.add(subtotal);

                ProductionSuggestionDTO.SuggestionItem item = new ProductionSuggestionDTO.SuggestionItem();
                item.productId         = product.id;
                item.productName       = product.name;
                item.productValue      = product.value;
                item.producibleQuantity = producibleQty;
                item.subtotal          = subtotal;
                suggestions.add(item);
            }
        }

        ProductionSuggestionDTO result = new ProductionSuggestionDTO();
        result.suggestions = suggestions;
        result.totalValue  = totalValue;
        return result;
    }
}
