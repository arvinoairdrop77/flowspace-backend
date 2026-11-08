package com.flowspace.flowspace_backend.service;

import com.flowspace.flowspace_backend.entity.Board;
import com.flowspace.flowspace_backend.entity.User;
import com.flowspace.flowspace_backend.repository.BoardRepository;
import com.flowspace.flowspace_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public List<Board> getUserBoards(String username) {
        return boardRepository.findByUserUsernameOrderByIdDesc(username);
    }

    public Board createBoard(String boardName, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        Board board = Board.builder().name(boardName).user(user).build();
        return boardRepository.save(board);
    }

    public void deleteBoard(Board board) {
        boardRepository.delete(board);
    }

    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }
}