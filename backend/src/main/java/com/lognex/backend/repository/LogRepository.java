package com.lognex.backend.repository;

import com.lognex.backend.model.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.repository.query.Param;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    Page<Log> findByLevel(String level, Pageable pageable);
    Page<Log> findByServer(String server, Pageable pageable);
    Page<Log> findByLevelAndServer(String level, String server, Pageable pageable);
    Page<Log> findByTimestampBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);
    long countByLevel(String level);
    long countByLevelAndSeverity(String level, String severity);
    @Query("select l from Log l where (:level is null or l.level = upper(:level)) " +
            "and (:server is null or l.server = :server) and (:source is null or l.source = :source) " +
            "and (:ipAddress is null or l.ipAddress = :ipAddress) " +
            "and (:severity is null or l.severity = upper(:severity)) " +
            "and (:environment is null or l.environment = :environment) " +
            "and (:message is null or lower(l.message) like lower(concat('%', :message, '%'))) " +
            "and (:fromTime is null or l.timestamp >= :fromTime) " +
            "and (:toTime is null or l.timestamp <= :toTime)")
    Page<Log> search(@Param("level") String level, @Param("server") String server,
                     @Param("source") String source, @Param("ipAddress") String ipAddress,
                     @Param("severity") String severity, @Param("environment") String environment,
                     @Param("message") String message, @Param("fromTime") LocalDateTime from,
                     @Param("toTime") LocalDateTime to, Pageable pageable);
    List<Log> findByServerOrderByTimestampDesc(String server);

    @Query("select new com.lognex.backend.dto.LevelDistribution(l.level, count(l)) from Log l group by l.level")
    List<com.lognex.backend.dto.LevelDistribution> countByLevelGrouped();

    @Query("select new com.lognex.backend.dto.LevelDistribution(l.source, count(l)) from Log l group by l.source")
    List<com.lognex.backend.dto.LevelDistribution> countBySourceGrouped();

    @Query("select count(distinct l.server) from Log l")
    long countDistinctServers();
}
