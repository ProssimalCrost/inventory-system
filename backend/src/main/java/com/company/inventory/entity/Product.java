package com.company.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    public String name;

    @NotNull(message = "Value is required")
    @PositiveOrZero(message = "Value must be zero or positive")
    @Column(nullable = false, precision = 15, scale = 2)
    public BigDecimal value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    public List<ProductRawMaterial> rawMaterials = new ArrayList<>();

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

    // ── Named Queries ──────────────────────────────────────
    public static List<Product> findAllWithRawMaterials() {
        return find("SELECT DISTINCT p FROM Product p " +
                    "LEFT JOIN FETCH p.rawMaterials prm " +
                    "LEFT JOIN FETCH prm.rawMaterial " +
                    "ORDER BY p.name").list();
    }

    public static List<Product> findAllOrderByValueDesc() {
        return find("ORDER BY value DESC").list();
    }
}
