package com.flowspace.flowspace_backend.service;

import com.flowspace.flowspace_backend.entity.Card;
import com.flowspace.flowspace_backend.entity.TaskList;
import com.flowspace.flowspace_backend.repository.CardRepository;
import com.flowspace.flowspace_backend.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;

    // UBAH JADI VOID BREE
    public void moveCard(Long cardId, Long newListId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card tidak ditemukan"));
        TaskList newList = taskListRepository.findById(newListId)
                .orElseThrow(() -> new RuntimeException("List tidak ditemukan"));

        card.setList(newList);
        cardRepository.save(card);
    }
}