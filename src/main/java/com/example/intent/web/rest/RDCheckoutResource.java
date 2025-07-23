package com.example.intent.web.rest;

import com.example.intent.domain.RDCheckout;
import com.example.intent.repository.RDCheckoutRepository;
import com.example.intent.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.example.intent.domain.RDCheckout}.
 */
@RestController
@RequestMapping("/api/rd-checkouts")
@Transactional
public class RDCheckoutResource {

    private static final Logger LOG = LoggerFactory.getLogger(RDCheckoutResource.class);

    private static final String ENTITY_NAME = "rDCheckout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RDCheckoutRepository rDCheckoutRepository;

    public RDCheckoutResource(RDCheckoutRepository rDCheckoutRepository) {
        this.rDCheckoutRepository = rDCheckoutRepository;
    }

    /**
     * {@code POST  /rd-checkouts} : Create a new rDCheckout.
     *
     * @param rDCheckout the rDCheckout to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rDCheckout, or with status {@code 400 (Bad Request)} if the rDCheckout has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RDCheckout> createRDCheckout(@Valid @RequestBody RDCheckout rDCheckout) throws URISyntaxException {
        LOG.debug("REST request to save RDCheckout : {}", rDCheckout);
        if (rDCheckout.getId() != null) {
            throw new BadRequestAlertException("A new rDCheckout cannot already have an ID", ENTITY_NAME, "idexists");
        }
        rDCheckout = rDCheckoutRepository.save(rDCheckout);
        return ResponseEntity.created(new URI("/api/rd-checkouts/" + rDCheckout.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, rDCheckout.getId()))
            .body(rDCheckout);
    }

    /**
     * {@code PUT  /rd-checkouts/:id} : Updates an existing rDCheckout.
     *
     * @param id the id of the rDCheckout to save.
     * @param rDCheckout the rDCheckout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rDCheckout,
     * or with status {@code 400 (Bad Request)} if the rDCheckout is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rDCheckout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RDCheckout> updateRDCheckout(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody RDCheckout rDCheckout
    ) throws URISyntaxException {
        LOG.debug("REST request to update RDCheckout : {}, {}", id, rDCheckout);
        if (rDCheckout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rDCheckout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rDCheckoutRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        rDCheckout = rDCheckoutRepository.save(rDCheckout);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rDCheckout.getId()))
            .body(rDCheckout);
    }

    /**
     * {@code PATCH  /rd-checkouts/:id} : Partial updates given fields of an existing rDCheckout, field will ignore if it is null
     *
     * @param id the id of the rDCheckout to save.
     * @param rDCheckout the rDCheckout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rDCheckout,
     * or with status {@code 400 (Bad Request)} if the rDCheckout is not valid,
     * or with status {@code 404 (Not Found)} if the rDCheckout is not found,
     * or with status {@code 500 (Internal Server Error)} if the rDCheckout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RDCheckout> partialUpdateRDCheckout(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody RDCheckout rDCheckout
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update RDCheckout partially : {}, {}", id, rDCheckout);
        if (rDCheckout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rDCheckout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rDCheckoutRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RDCheckout> result = rDCheckoutRepository
            .findById(rDCheckout.getId())
            .map(existingRDCheckout -> {
                if (rDCheckout.getStatus() != null) {
                    existingRDCheckout.setStatus(rDCheckout.getStatus());
                }
                if (rDCheckout.getPaymentStatus() != null) {
                    existingRDCheckout.setPaymentStatus(rDCheckout.getPaymentStatus());
                }
                if (rDCheckout.getOrderId() != null) {
                    existingRDCheckout.setOrderId(rDCheckout.getOrderId());
                }
                if (rDCheckout.getOrderDeliveryStatus() != null) {
                    existingRDCheckout.setOrderDeliveryStatus(rDCheckout.getOrderDeliveryStatus());
                }

                return existingRDCheckout;
            })
            .map(rDCheckoutRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rDCheckout.getId())
        );
    }

    /**
     * {@code GET  /rd-checkouts} : get all the rDCheckouts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rDCheckouts in body.
     */
    @GetMapping("")
    public List<RDCheckout> getAllRDCheckouts() {
        LOG.debug("REST request to get all RDCheckouts");
        return rDCheckoutRepository.findAll();
    }

    /**
     * {@code GET  /rd-checkouts/:id} : get the "id" rDCheckout.
     *
     * @param id the id of the rDCheckout to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rDCheckout, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RDCheckout> getRDCheckout(@PathVariable("id") String id) {
        LOG.debug("REST request to get RDCheckout : {}", id);
        Optional<RDCheckout> rDCheckout = rDCheckoutRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rDCheckout);
    }

    /**
     * {@code DELETE  /rd-checkouts/:id} : delete the "id" rDCheckout.
     *
     * @param id the id of the rDCheckout to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRDCheckout(@PathVariable("id") String id) {
        LOG.debug("REST request to delete RDCheckout : {}", id);
        rDCheckoutRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
