package com.company.inventory.resource;

import com.company.inventory.dto.RawMaterialDTO;
import com.company.inventory.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @Inject
    RawMaterialService rawMaterialService;

    @GET
    public List<RawMaterialDTO> findAll() {
        return rawMaterialService.findAll();
    }

    @GET
    @Path("/{id}")
    public RawMaterialDTO findById(@PathParam("id") Long id) {
        return rawMaterialService.findById(id);
    }

    @POST
    public Response create(@Valid RawMaterialDTO dto) {
        RawMaterialDTO created = rawMaterialService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public RawMaterialDTO update(@PathParam("id") Long id, @Valid RawMaterialDTO dto) {
        return rawMaterialService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        rawMaterialService.delete(id);
        return Response.noContent().build();
    }
}
