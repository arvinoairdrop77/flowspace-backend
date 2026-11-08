package com.flowspace.flowspace_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CardResponse {
    private Long id;
    private String title;
    private String description;
    private String labelColor;
    
    private String tag;
    private String priority;
    private String dueDate;

    // TAMBAHAN BUAT SUBTASKS
    private List<SubtaskResponse> subtasks;

    // Inner class buat nampung data checklist
    @Data
    public static class SubtaskResponse {
        private Long id;
        private String title;
        private boolean completed;
    }

    // Commant
    private String assignee;
    private List<CommentResponse> comments;

    @Data
    public static class CommentResponse {
        private Long id;
        private String userName;
        private String text;
        private String timestamp;
    }
}