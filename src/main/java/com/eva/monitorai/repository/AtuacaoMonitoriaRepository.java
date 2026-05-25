package com.eva.monitorai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.AtuacaoMonitoria;

public interface AtuacaoMonitoriaRepository extends JpaRepository<AtuacaoMonitoria, Long> {

    List<AtuacaoMonitoria> findByMonitoriaId(Long monitoriaId);
    
    List<AtuacaoMonitoria> findByMonitorId(Long monitorId);
    
    Optional<AtuacaoMonitoria> findByMonitoriaIdAndAtivaTrue(Long monitoriaId);
    
    Optional<AtuacaoMonitoria> findByMonitorIdAndAtivaTrue(Long monitorId);
}