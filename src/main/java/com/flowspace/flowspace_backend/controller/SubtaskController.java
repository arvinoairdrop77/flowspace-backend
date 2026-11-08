package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.Subtask;
import com.flowspace.flowspace_backend.repository.SubtaskRepository;
import com.flowspace.flowspace_backend.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subtasks")
@RequiredArgsConstructor
public class SubtaskController {
    private final SubtaskRepository subtaskRepository;
    private final CardRepository cardRepository;

    @PostMapping("/card/{cardId}")
    public ResponseEntity<Subtask> addSubtask(@PathVariable Long cardId, @RequestBody Subtask subtask) {
        return cardRepository.findById(cardId).map(card -> {
            subtask.setCard(card);
            subtask.setCompleted(false);
            return ResponseEntity.ok(subtaskRepository.save(subtask));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{subtaskId}/toggle")
    public ResponseEntity<Subtask> toggleSubtask(@PathVariable Long subtaskId) {
        return subtaskRepository.findById(subtaskId).map(subtask -> {
            subtask.setCompleted(!subtask.isCompleted());
            return ResponseEntity.ok(subtaskRepository.save(subtask));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{subtaskId}")
    public ResponseEntity<?> deleteSubtask(@PathVariable Long subtaskId) {
        return subtaskRepository.findById(subtaskId).map(subtask -> {
            subtaskRepository.delete(subtask);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}