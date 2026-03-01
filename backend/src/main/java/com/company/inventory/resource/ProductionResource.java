package com.company.inventory.resource;

import com.company.inventory.dto.ProductionSuggestionDTO;
import com.company.inventory.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @Inject
    ProductionService productionService;

    @GET
    @Path("/suggestions")
    public ProductionSuggestionDTO getSuggestions() {
        return productionService.getSuggestions();
    }
}
