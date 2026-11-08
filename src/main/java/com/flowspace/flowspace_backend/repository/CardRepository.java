package com.flowspace.flowspace_backend.repository;

import com.flowspace.flowspace_backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}