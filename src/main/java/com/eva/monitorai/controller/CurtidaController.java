package com.eva.monitorai.controller;

import com.eva.monitorai.service.CurtidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/curtidas")
public class CurtidaController {

    @Autowired
    private CurtidaService curtidaService;

    @PostMapping("/{materialId}")
    public ResponseEntity<?> toggleCurtida(
            @PathVariable Long materialId,
            Authentication auth
    ){

        String username = auth.getName();

        long totalCurtidas =
                curtidaService.toggleCurtida(materialId, username);

        return ResponseEntity.ok(
                Map.of("totalCurtidas", totalCurtidas)
        );
    }
}