package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.Note;
import com.flowspace.flowspace_backend.repository.NoteRepository;
import com.flowspace.flowspace_backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NoteController {
    private final NoteRepository noteRepository;
    private final BoardRepository boardRepository;

    @GetMapping("/boards/{boardId}/notes")
    public ResponseEntity<List<Note>> getNotes(@PathVariable Long boardId) {
        return ResponseEntity.ok(noteRepository.findByBoardId(boardId));
    }

    @PostMapping("/boards/{boardId}/notes")
    public ResponseEntity<Note> createNote(@PathVariable Long boardId, @RequestBody Note note) {
        return boardRepository.findById(boardId).map(board -> {
            note.setBoard(board);
            return ResponseEntity.ok(noteRepository.save(note));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/notes/{noteId}")
    public ResponseEntity<Note> updateNote(@PathVariable Long noteId, @RequestBody Note noteDetails) {
        return noteRepository.findById(noteId).map(note -> {
            note.setTitle(noteDetails.getTitle());
            note.setDescription(noteDetails.getDescription());
            note.setDate(noteDetails.getDate());
            note.setTime(noteDetails.getTime());
            note.setCategory(noteDetails.getCategory());
            note.setColor(noteDetails.getColor());
            note.setCompleted(noteDetails.isCompleted());
            return ResponseEntity.ok(noteRepository.save(note));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long noteId) {
        return noteRepository.findById(noteId).map(note -> {
            noteRepository.delete(note);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}