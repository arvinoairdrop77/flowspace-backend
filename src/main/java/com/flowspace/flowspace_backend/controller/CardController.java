package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.Card;
import com.flowspace.flowspace_backend.service.CardService;
import com.flowspace.flowspace_backend.repository.CardRepository;
import com.flowspace.flowspace_backend.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;
    private final CardService cardService;

    // 1. BIKIN CARD BARU (Return Simple String biar ga error Hibernate)
    @PostMapping("/list/{listId}")
    public ResponseEntity<?> createCard(@PathVariable Long listId, @RequestBody Card card) {
        return taskListRepository.findById(listId).map(list -> {
            card.setList(list);
            cardRepository.save(card);
            return ResponseEntity.ok().build(); // <--- Cukup OK aja
        }).orElse(ResponseEntity.notFound().build());
    }

    // 2. PINDAH CARD / DRAG & DROP
    @PutMapping("/{cardId}/move/{newListId}")
    public ResponseEntity<?> moveCard(@PathVariable Long cardId, @PathVariable Long newListId) {
        cardService.moveCard(cardId, newListId);
        return ResponseEntity.ok().build();
    }

    // 3. EDIT / UPDATE CARD
    @PutMapping("/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Long cardId, @RequestBody Card cardDetails) {
        return cardRepository.findById(cardId).map(card -> {
            card.setTitle(cardDetails.getTitle());
            card.setDescription(cardDetails.getDescription());
            card.setTag(cardDetails.getTag());
            card.setPriority(cardDetails.getPriority());
            card.setDueDate(cardDetails.getDueDate());
            card.setLabelColor(cardDetails.getLabelColor());
            cardRepository.save(card);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. HAPUS CARD
    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        return cardRepository.findById(cardId).map(card -> {
            cardRepository.delete(card);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}