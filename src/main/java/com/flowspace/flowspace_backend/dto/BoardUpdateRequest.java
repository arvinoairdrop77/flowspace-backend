package com.flowspace.flowspace_backend.dto;
import lombok.Data;

@Data
public class BoardUpdateRequest {
    private String name;
    private String tags;
}