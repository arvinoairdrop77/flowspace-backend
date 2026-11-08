package com.flowspace.flowspace_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BoardResponse {
    private Long id;
    private String name;
    private String tags;
    private List<ListResponse> lists;
}