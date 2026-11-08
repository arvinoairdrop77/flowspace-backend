package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.dto.BoardResponse;
import com.flowspace.flowspace_backend.dto.CardResponse;
import com.flowspace.flowspace_backend.dto.ListResponse;
import com.flowspace.flowspace_backend.entity.Board;
import com.flowspace.flowspace_backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardResponse>> getMyBoards(Authentication auth) {
        List<Board> boards = boardService.getUserBoards(auth.getName());
        
        List<BoardResponse> response = boards.stream().map(board -> {
            BoardResponse br = new BoardResponse();
            br.setId(board.getId());
            br.setName(board.getName());
            br.setTags(board.getTags());
            
            if (board.getLists() != null) {
                br.setLists(board.getLists().stream().map(list -> {
                    ListResponse lr = new ListResponse();
                    lr.setId(list.getId());
                    lr.setName(list.getName());
                    lr.setColor(list.getColor());
                    
                    if (list.getCards() != null) {
                        lr.setCards(list.getCards().stream().map(card -> {
                            CardResponse cr = new CardResponse();
                            cr.setId(card.getId()); 
                            cr.setTitle(card.getTitle());
                            cr.setDescription(card.getDescription());
                            cr.setLabelColor(card.getLabelColor());
                            cr.setTag(card.getTag());
                            cr.setPriority(card.getPriority());
                            cr.setDueDate(card.getDueDate());
                            cr.setAssignee(card.getAssignee());
                            
                            if (card.getSubtasks() != null) {
                                cr.setSubtasks(card.getSubtasks().stream().map(st -> {
                                    CardResponse.SubtaskResponse str = new CardResponse.SubtaskResponse();
                                    str.setId(st.getId());
                                    str.setTitle(st.getTitle());
                                    str.setCompleted(st.isCompleted());
                                    return str;
                                }).collect(Collectors.toList()));
                            }

                            if (card.getComments() != null) {
                                cr.setComments(card.getComments().stream().map(c -> {
                                    CardResponse.CommentResponse comRes = new CardResponse.CommentResponse();
                                    comRes.setId(c.getId());
                                    comRes.setUserName(c.getUserName());
                                    comRes.setText(c.getText());
                                    comRes.setTimestamp(c.getTimestamp());
                                    return comRes;
                                }).collect(Collectors.toList()));
                            }
                            return cr;
                        }).collect(Collectors.toList()));
                    }
                    return lr;
                }).collect(Collectors.toList()));
            }
            return br;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, Authentication auth) {
        return ResponseEntity.ok(boardService.createBoard(board.getName(), auth.getName()));
    }

    // ENDPOINT BARU BUAT EDIT NAMA & TAG
    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateBoard(@PathVariable Long boardId, @RequestBody com.flowspace.flowspace_backend.dto.BoardUpdateRequest request, Authentication auth) {
        return boardService.getUserBoards(auth.getName()).stream()
                .filter(b -> b.getId().equals(boardId))
                .findFirst()
                .map(board -> {
                    board.setName(request.getName());
                    board.setTags(request.getTags());
                    boardService.saveBoard(board); 
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId, Authentication auth) {
        return boardService.getUserBoards(auth.getName()).stream()
                .filter(b -> b.getId().equals(boardId))
                .findFirst()
                .map(board -> {
                    boardService.deleteBoard(board);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}