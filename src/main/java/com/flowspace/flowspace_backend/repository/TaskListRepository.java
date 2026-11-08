package com.flowspace.flowspace_backend.repository;

import com.flowspace.flowspace_backend.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
}