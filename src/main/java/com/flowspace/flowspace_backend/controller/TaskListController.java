package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.TaskList;
import com.flowspace.flowspace_backend.repository.TaskListRepository;
import com.flowspace.flowspace_backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class TaskListController {
    
    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;

    @PostMapping("/board/{boardId}")
    public ResponseEntity<?> createList(@PathVariable Long boardId, @RequestBody TaskList taskList) {
        return boardRepository.findById(boardId).map(board -> {
            taskList.setBoard(board);
            taskList.setCards(new java.util.ArrayList<>());
            taskListRepository.save(taskList); 
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteList(@PathVariable Long listId) {
        return taskListRepository.findById(listId).map(list -> {
            taskListRepository.delete(list);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}