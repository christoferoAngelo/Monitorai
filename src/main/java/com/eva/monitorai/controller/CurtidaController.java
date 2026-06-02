package com.eva.monitorai.controller;

import com.eva.monitorai.dto.CurtidaDTO;
import com.eva.monitorai.service.CurtidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/curtidas")
public class CurtidaController {

    @Autowired
    private CurtidaService curtidaService;

    @PostMapping("/{materialId}")
    public ResponseEntity<CurtidaDTO> toggleCurtida(
            @PathVariable Long materialId,
            Authentication auth
    ){

        String username = auth.getName();

        CurtidaDTO dto =
                curtidaService.toggleCurtida(
                        materialId,
                        username
                );

        return ResponseEntity.ok(dto);
    }
}