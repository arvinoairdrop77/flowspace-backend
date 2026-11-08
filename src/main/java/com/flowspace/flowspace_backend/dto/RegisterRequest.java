package com.flowspace.flowspace_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @NotBlank private String username;
    @NotBlank private String password;
}