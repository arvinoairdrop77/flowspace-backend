package com.flowspace.flowspace_backend.repository;

import com.flowspace.flowspace_backend.entity.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
}