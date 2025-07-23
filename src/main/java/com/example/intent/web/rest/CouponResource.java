package com.example.intent.web.rest;

import com.example.intent.domain.Coupon;
import com.example.intent.repository.CouponRepository;
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
 * REST controller for managing {@link com.example.intent.domain.Coupon}.
 */
@RestController
@RequestMapping("/api/coupons")
@Transactional
public class CouponResource {

    private static final Logger LOG = LoggerFactory.getLogger(CouponResource.class);

    private static final String ENTITY_NAME = "coupon";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CouponRepository couponRepository;

    public CouponResource(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    /**
     * {@code POST  /coupons} : Create a new coupon.
     *
     * @param coupon the coupon to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new coupon, or with status {@code 400 (Bad Request)} if the coupon has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody Coupon coupon) throws URISyntaxException {
        LOG.debug("REST request to save Coupon : {}", coupon);
        if (coupon.getId() != null) {
            throw new BadRequestAlertException("A new coupon cannot already have an ID", ENTITY_NAME, "idexists");
        }
        coupon = couponRepository.save(coupon);
        return ResponseEntity.created(new URI("/api/coupons/" + coupon.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, coupon.getId()))
            .body(coupon);
    }

    /**
     * {@code PUT  /coupons/:id} : Updates an existing coupon.
     *
     * @param id the id of the coupon to save.
     * @param coupon the coupon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coupon,
     * or with status {@code 400 (Bad Request)} if the coupon is not valid,
     * or with status {@code 500 (Internal Server Error)} if the coupon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Coupon coupon
    ) throws URISyntaxException {
        LOG.debug("REST request to update Coupon : {}, {}", id, coupon);
        if (coupon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coupon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!couponRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        coupon = couponRepository.save(coupon);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, coupon.getId()))
            .body(coupon);
    }

    /**
     * {@code PATCH  /coupons/:id} : Partial updates given fields of an existing coupon, field will ignore if it is null
     *
     * @param id the id of the coupon to save.
     * @param coupon the coupon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coupon,
     * or with status {@code 400 (Bad Request)} if the coupon is not valid,
     * or with status {@code 404 (Not Found)} if the coupon is not found,
     * or with status {@code 500 (Internal Server Error)} if the coupon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Coupon> partialUpdateCoupon(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Coupon coupon
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Coupon partially : {}, {}", id, coupon);
        if (coupon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coupon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!couponRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Coupon> result = couponRepository
            .findById(coupon.getId())
            .map(existingCoupon -> {
                if (coupon.getText() != null) {
                    existingCoupon.setText(coupon.getText());
                }
                if (coupon.getType() != null) {
                    existingCoupon.setType(coupon.getType());
                }
                if (coupon.getValue() != null) {
                    existingCoupon.setValue(coupon.getValue());
                }

                return existingCoupon;
            })
            .map(couponRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, coupon.getId()));
    }

    /**
     * {@code GET  /coupons} : get all the coupons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of coupons in body.
     */
    @GetMapping("")
    public List<Coupon> getAllCoupons() {
        LOG.debug("REST request to get all Coupons");
        return couponRepository.findAll();
    }

    /**
     * {@code GET  /coupons/:id} : get the "id" coupon.
     *
     * @param id the id of the coupon to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the coupon, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCoupon(@PathVariable("id") String id) {
        LOG.debug("REST request to get Coupon : {}", id);
        Optional<Coupon> coupon = couponRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(coupon);
    }

    /**
     * {@code DELETE  /coupons/:id} : delete the "id" coupon.
     *
     * @param id the id of the coupon to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable("id") String id) {
        LOG.debug("REST request to delete Coupon : {}", id);
        couponRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
