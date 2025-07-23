package com.example.intent.repository;

import com.example.intent.domain.StoreManager;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StoreManager entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoreManagerRepository extends JpaRepository<StoreManager, UUID> {}
