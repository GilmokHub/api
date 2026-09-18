package kr.gilmok.platform.policy.repository;

import kr.gilmok.platform.policy.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByEventId(Long eventId);

    boolean existsByEventId(Long eventId);
}
