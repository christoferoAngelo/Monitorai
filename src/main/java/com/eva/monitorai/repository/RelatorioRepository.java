package com.eva.monitorai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eva.monitorai.model.entity.RelatorioMonitoria;
import java.util.List;

public interface RelatorioRepository extends JpaRepository<RelatorioMonitoria, Long> {
    // Para o Admin ver o desempenho de um monitor específico
    List<RelatorioMonitoria> findByMonitoriaMonitorId(Long monitorId);
    List<RelatorioMonitoria> findByMonitoriaId(Long monitoriaId);
}