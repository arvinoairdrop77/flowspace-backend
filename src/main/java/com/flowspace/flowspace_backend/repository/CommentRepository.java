package com.flowspace.flowspace_backend.repository;
import com.flowspace.flowspace_backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CommentRepository extends JpaRepository<Comment, Long> {}