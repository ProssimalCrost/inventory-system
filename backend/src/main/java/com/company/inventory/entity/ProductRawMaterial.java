package com.company.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_raw_materials")
public class ProductRawMaterial extends PanacheEntityBase {

    @EmbeddedId
    public ProductRawMaterialId id = new ProductRawMaterialId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    public Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("rawMaterialId")
    @JoinColumn(name = "raw_material_id")
    public RawMaterial rawMaterial;

    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    @Column(name = "required_quantity", nullable = false, precision = 15, scale = 3)
    public BigDecimal requiredQuantity;

    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static void deleteByProductAndRawMaterial(Long productId, Long rawMaterialId) {
        delete("id.productId = ?1 AND id.rawMaterialId = ?2", productId, rawMaterialId);
    }
}
