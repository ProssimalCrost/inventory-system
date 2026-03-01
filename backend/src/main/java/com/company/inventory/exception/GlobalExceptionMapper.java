package com.company.inventory.exception;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;
import java.util.stream.Collectors;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {

        if (exception instanceof NotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity(Map.of("error", exception.getMessage()))
                           .build();
        }

        if (exception instanceof ConstraintViolationException cve) {
            var errors = cve.getConstraintViolations().stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .collect(Collectors.toList());
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("errors", errors))
                           .build();
        }

        if (exception instanceof IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("error", exception.getMessage()))
                           .build();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                       .entity(Map.of("error", "An unexpected error occurred"))
                       .build();
    }
}
