package com.flowspace.flowspace_backend.repository;

import com.flowspace.flowspace_backend.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUserUsernameOrderByIdDesc(String username);
}