package com.flowspace.flowspace_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ListResponse {
    private Long id;
    private String name;
    private String color;
    private List<CardResponse> cards;
}