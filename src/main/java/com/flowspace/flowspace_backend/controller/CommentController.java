package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.Comment;
import com.flowspace.flowspace_backend.repository.CommentRepository;
import com.flowspace.flowspace_backend.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentRepository commentRepository;
    private final CardRepository cardRepository;

    @PostMapping("/card/{cardId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long cardId, @RequestBody Comment comment, Authentication auth) {
        return cardRepository.findById(cardId).map(card -> {
            comment.setCard(card);
            comment.setUserName(auth.getName()); // Ambil username dari token JWT
            comment.setTimestamp("Baru saja"); // Bisa diganti format tanggal lokal
            return ResponseEntity.ok(commentRepository.save(comment));
        }).orElse(ResponseEntity.notFound().build());
    }
}