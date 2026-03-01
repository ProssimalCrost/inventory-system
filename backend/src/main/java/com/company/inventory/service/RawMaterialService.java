package com.company.inventory.service;

import com.company.inventory.dto.RawMaterialDTO;
import com.company.inventory.entity.ProductRawMaterial;
import com.company.inventory.entity.RawMaterial;
import com.company.inventory.exception.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class RawMaterialService {

    public List<RawMaterialDTO> findAll() {
        return RawMaterial.<RawMaterial>listAll().stream()
                          .map(this::toDTO)
                          .toList();
    }

    public RawMaterialDTO findById(Long id) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found: " + id);
        return toDTO(rm);
    }

    @Transactional
    public RawMaterialDTO create(RawMaterialDTO dto) {
        RawMaterial rm = new RawMaterial();
        rm.name          = dto.name;
        rm.stockQuantity = dto.stockQuantity;
        rm.persist();
        return toDTO(rm);
    }

    @Transactional
    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found: " + id);
        rm.name          = dto.name;
        rm.stockQuantity = dto.stockQuantity;
        return toDTO(rm);
    }

    @Transactional
    public void delete(Long id) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found: " + id);

        long usages = ProductRawMaterial.count("id.rawMaterialId", id);
        if (usages > 0) {
            throw new IllegalArgumentException(
                "Cannot delete raw material in use by " + usages + " product(s)");
        }
        rm.delete();
    }

    // ── Mapper ──────────────────────────────────────────────

    public RawMaterialDTO toDTO(RawMaterial rm) {
        RawMaterialDTO dto = new RawMaterialDTO();
        dto.id            = rm.id;
        dto.name          = rm.name;
        dto.stockQuantity = rm.stockQuantity;
        return dto;
    }
}
