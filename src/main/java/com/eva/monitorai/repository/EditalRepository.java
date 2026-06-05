package com.eva.monitorai.repository;

import com.eva.monitorai.model.entity.Edital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EditalRepository extends JpaRepository<Edital, Long> {
    List<Edital> findAllByOrderByDataPublicacaoDesc();
    List<Edital> findByStatus(String status);
    List<Edital> findByStatusAndTipo(String status, String tipo);
}