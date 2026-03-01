package com.company.inventory.service;

import com.company.inventory.dto.AssociationRequest;
import com.company.inventory.dto.ProductDTO;
import com.company.inventory.entity.Product;
import com.company.inventory.entity.ProductRawMaterial;
import com.company.inventory.entity.ProductRawMaterialId;
import com.company.inventory.entity.RawMaterial;
import com.company.inventory.exception.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ProductService {

    public List<ProductDTO> findAll() {
        return Product.findAllWithRawMaterials().stream()
                      .map(this::toDTO)
                      .toList();
    }

    public ProductDTO findById(Long id) {
        Product product = Product.findById(id);
        if (product == null) throw new NotFoundException("Product not found: " + id);
        return toDTO(product);
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        Product product = new Product();
        product.name  = dto.name;
        product.value = dto.value;
        product.persist();
        return toDTO(product);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = Product.findById(id);
        if (product == null) throw new NotFoundException("Product not found: " + id);
        product.name  = dto.name;
        product.value = dto.value;
        return toDTO(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = Product.findById(id);
        if (product == null) throw new NotFoundException("Product not found: " + id);
        product.delete();
    }

    @Transactional
    public ProductDTO addRawMaterial(Long productId, AssociationRequest request) {
        Product product = Product.findById(productId);
        if (product == null) throw new NotFoundException("Product not found: " + productId);

        RawMaterial rawMaterial = RawMaterial.findById(request.rawMaterialId);
        if (rawMaterial == null) throw new NotFoundException("Raw material not found: " + request.rawMaterialId);

        // Update if already exists
        ProductRawMaterial existing = ProductRawMaterial.findById(
                new ProductRawMaterialId(productId, request.rawMaterialId));
        if (existing != null) {
            existing.requiredQuantity = request.requiredQuantity;
        } else {
            ProductRawMaterial prm = new ProductRawMaterial();
            prm.id               = new ProductRawMaterialId(productId, request.rawMaterialId);
            prm.product          = product;
            prm.rawMaterial      = rawMaterial;
            prm.requiredQuantity = request.requiredQuantity;
            prm.persist();
        }
        // Reload
        return findById(productId);
    }

    @Transactional
    public void removeRawMaterial(Long productId, Long rawMaterialId) {
        if (Product.findById(productId) == null)
            throw new NotFoundException("Product not found: " + productId);
        long deleted = ProductRawMaterial.delete(
                "id.productId = ?1 AND id.rawMaterialId = ?2", productId, rawMaterialId);
        if (deleted == 0)
            throw new NotFoundException("Association not found");
    }

    // ── Mapper ──────────────────────────────────────────────

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.id    = product.id;
        dto.name  = product.name;
        dto.value = product.value;
        dto.rawMaterials = product.rawMaterials.stream().map(prm -> {
            ProductDTO.ProductRawMaterialDTO r = new ProductDTO.ProductRawMaterialDTO();
            r.rawMaterialId   = prm.rawMaterial.id;
            r.rawMaterialName = prm.rawMaterial.name;
            r.requiredQuantity = prm.requiredQuantity;
            return r;
        }).toList();
        return dto;
    }
}
