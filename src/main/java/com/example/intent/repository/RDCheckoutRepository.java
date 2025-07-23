package com.example.intent.repository;

import com.example.intent.domain.RDCheckout;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RDCheckout entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RDCheckoutRepository extends JpaRepository<RDCheckout, String> {}
