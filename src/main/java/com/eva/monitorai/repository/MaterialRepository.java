package com.eva.monitorai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eva.monitorai.model.entity.Material;

public interface MaterialRepository extends JpaRepository<Material, Long>{

}