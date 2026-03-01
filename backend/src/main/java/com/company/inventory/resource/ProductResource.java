package com.company.inventory.resource;

import com.company.inventory.dto.AssociationRequest;
import com.company.inventory.dto.ProductDTO;
import com.company.inventory.service.ProductService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    public List<ProductDTO> findAll() {
        return productService.findAll();
    }

    @GET
    @Path("/{id}")
    public ProductDTO findById(@PathParam("id") Long id) {
        return productService.findById(id);
    }

    @POST
    public Response create(@Valid ProductDTO dto) {
        ProductDTO created = productService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public ProductDTO update(@PathParam("id") Long id, @Valid ProductDTO dto) {
        return productService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        productService.delete(id);
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/raw-materials")
    public Response addRawMaterial(@PathParam("id") Long id, @Valid AssociationRequest request) {
        ProductDTO updated = productService.addRawMaterial(id, request);
        return Response.status(Response.Status.CREATED).entity(updated).build();
    }

    @DELETE
    @Path("/{id}/raw-materials/{rawMaterialId}")
    public Response removeRawMaterial(@PathParam("id") Long id,
                                      @PathParam("rawMaterialId") Long rawMaterialId) {
        productService.removeRawMaterial(id, rawMaterialId);
        return Response.noContent().build();
    }
}
