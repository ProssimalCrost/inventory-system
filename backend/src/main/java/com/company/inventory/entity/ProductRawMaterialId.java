package com.company.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductRawMaterialId implements Serializable {

    @Column(name = "product_id")
    public Long productId;

    @Column(name = "raw_material_id")
    public Long rawMaterialId;

    public ProductRawMaterialId() {}

    public ProductRawMaterialId(Long productId, Long rawMaterialId) {
        this.productId = productId;
        this.rawMaterialId = rawMaterialId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductRawMaterialId)) return false;
        ProductRawMaterialId that = (ProductRawMaterialId) o;
        return Objects.equals(productId, that.productId) &&
               Objects.equals(rawMaterialId, that.rawMaterialId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, rawMaterialId);
    }
}
