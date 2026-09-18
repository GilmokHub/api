package kr.gilmok.platform.ai.repository;

import kr.gilmok.platform.ai.entity.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    List<RequestLog> findTop100ByOrderByTimestampDesc();
}
