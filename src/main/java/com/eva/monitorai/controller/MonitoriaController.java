package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.MonitoriaDTO;
import com.eva.monitorai.model.entity.Monitoria;
import com.eva.monitorai.model.entity.AtuacaoMonitoria;
import com.eva.monitorai.repository.AtuacaoMonitoriaRepository;
import com.eva.monitorai.repository.MonitoriaRepository;
import com.eva.monitorai.service.MonitoriaService;

@RestController
@RequestMapping("/monitorias")
@CrossOrigin("*")
public class MonitoriaController {

    @Autowired
    private MonitoriaService monitoriaService;

    @Autowired
    private AtuacaoMonitoriaRepository atuacaoRepository;

    @Autowired
    private MonitoriaRepository monitoriaRepository;

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
    public Monitoria atualizar(@PathVariable Long id, @RequestBody MonitoriaDTO dto) {
        return monitoriaService.atualizar(id, dto);
    }

    // Trocar monitor
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

    // Reativar
    @PutMapping("/{id}/reativar")
    public Monitoria reativar(@PathVariable Long id) {
        Monitoria monitoria = monitoriaService.buscarPorId(id);
        monitoria.setAtiva(true);
        return monitoriaService.salvar(monitoria);
    }

    // Listar atuações de uma monitoria
    @GetMapping("/{id}/atuacoes")
    public List<AtuacaoMonitoria> listarAtuacoes(@PathVariable Long id) {
        return atuacaoRepository.findByMonitoriaId(id);
    }
    

	// Buscar monitoria por usuário (para o monitor acessar a dele)
    @GetMapping("/monitor/{usuarioId}")
    public List<Monitoria> buscarPorMonitor(@PathVariable Long usuarioId) {
        return monitoriaRepository.findByUsuarioId(usuarioId); 
    }
    
    
    @GetMapping("/historico")
    public ResponseEntity<List<AtuacaoMonitoria>> listarHistorico(
        @RequestParam(required = false) Long monitorId,
        @RequestParam(required = false) Long disciplinaId,
        @RequestParam(required = false) String anoSemestre
    ) {
        return ResponseEntity.ok(atuacaoRepository.buscarHistorico(monitorId, disciplinaId, anoSemestre));
    }
    
    @PostMapping("/finalizar-semestre")
    public ResponseEntity<String> finalizarSemestre() {
        return ResponseEntity.ok(monitoriaService.finalizarSemestre());
    }
    
    @GetMapping("/atuacoes/todas")
    public List<AtuacaoMonitoria> listarTodasAtuacoes() {
        return atuacaoRepository.findAll();
    }
}