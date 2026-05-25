package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.MonitoriaDTO;
import com.eva.monitorai.model.entity.Monitoria;
import com.eva.monitorai.service.MonitoriaService;

@RestController
@RequestMapping("/monitorias")
@CrossOrigin("*")
public class MonitoriaController {

    @Autowired
    private MonitoriaService monitoriaService;

    // Criar monitoria
    @PostMapping
    public Monitoria criar(@RequestBody MonitoriaDTO dto) {
        return monitoriaService.criarMonitoria(dto);
    }

    // Listar todas
    @GetMapping
    public List<Monitoria> listarTodas() {
        return monitoriaService.listarTodas();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public Monitoria buscarPorId(@PathVariable Long id) {
        return monitoriaService.buscarPorId(id);
    }

    // Atualizar
    @PutMapping("/{id}")
    public Monitoria atualizar(
            @PathVariable Long id,
            @RequestBody MonitoriaDTO dto) {

        return monitoriaService.atualizar(id, dto);
    }
    
    @PutMapping("/{monitoriaId}/trocar-monitor/{novoUsuarioId}")
    public Monitoria trocarMonitor(
            @PathVariable Long monitoriaId,
            @PathVariable Long novoUsuarioId) {

        return monitoriaService.trocarMonitor(monitoriaId, novoUsuarioId);
    }

    // Deletar
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        monitoriaService.deletar(id);
    }

    // Listar apenas monitorias ativas
    @GetMapping("/ativas")
    public List<Monitoria> listarAtivas() {
        return monitoriaService.listarAtivas();
    }
    
    @PutMapping("/{id}/reativar")
    public Monitoria reativar(@PathVariable Long id) {
        Monitoria monitoria = monitoriaService.buscarPorId(id);
        monitoria.setAtiva(true);
        return monitoriaService.salvar(monitoria);
    }
    
    
    
}