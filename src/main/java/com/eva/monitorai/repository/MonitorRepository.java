package com.eva.monitorai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Monitor;

public interface MonitorRepository extends JpaRepository<Monitor, Long> {

    Optional<Monitor> findByUsuarioId(Long usuarioId);
    List<Monitor> findByAtivoTrue();
}