package com.example.intent.repository;

import com.example.intent.domain.Intent;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Intent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IntentRepository extends JpaRepository<Intent, UUID> {
    @Query("select intent from Intent intent where intent.user.login = ?#{authentication.name}")
    List<Intent> findByUserIsCurrentUser();
}
