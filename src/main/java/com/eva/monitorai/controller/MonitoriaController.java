package com.eva.monitorai.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.MonitoriaDTO;
import com.eva.monitorai.dto.MonitoriaResponseDTO;
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
    public MonitoriaResponseDTO criar(@RequestBody MonitoriaDTO dto) {
        Monitoria monitoriaSalva = monitoriaService.criarMonitoria(dto);
        return monitoriaService.converterParaDTO(monitoriaSalva);
    }

    // Listar todas
    @GetMapping
    public List<MonitoriaResponseDTO> listarTodas() {
        return monitoriaService.listarTodas().stream()
                .map(monitoriaService::converterParaDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public MonitoriaResponseDTO buscarPorId(@PathVariable Long id) {
        Monitoria monitoria = monitoriaService.buscarPorId(id);
        return monitoriaService.converterParaDTO(monitoria);
    }

    // Atualizar
    @PutMapping("/{id}")
    public MonitoriaResponseDTO atualizar(@PathVariable Long id, @RequestBody MonitoriaDTO dto) {
        Monitoria monitoriaAtualizada = monitoriaService.atualizar(id, dto);
        return monitoriaService.converterParaDTO(monitoriaAtualizada);
    }

    // Trocar monitor
    @PutMapping("/{monitoriaId}/trocar-monitor/{novoUsuarioId}")
    public MonitoriaResponseDTO trocarMonitor(
            @PathVariable Long monitoriaId,
            @PathVariable Long novoUsuarioId) {
        Monitoria monitoriaModificada = monitoriaService.trocarMonitor(monitoriaId, novoUsuarioId);
        return monitoriaService.converterParaDTO(monitoriaModificada);
    }

    // Deletar
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        monitoriaService.deletar(id);
    }

    // Listar apenas monitorias ativas
    @GetMapping("/ativas")
    public List<MonitoriaResponseDTO> listarAtivas() {
        return monitoriaService.listarAtivas().stream()
                .map(monitoriaService::converterParaDTO)
                .collect(Collectors.toList());
    }

    // Reativar
    @PutMapping("/{id}/reativar")
    public MonitoriaResponseDTO reativar(@PathVariable Long id) {
        Monitoria monitoria = monitoriaService.buscarPorId(id);
        monitoria.setAtiva(true);
        Monitoria monitoriaSalva = monitoriaService.salvar(monitoria);
        return monitoriaService.converterParaDTO(monitoriaSalva);
    }

    // Listar atuações de uma monitoria
    @GetMapping("/{id}/atuacoes")
    public List<AtuacaoMonitoria> listarAtuacoes(@PathVariable Long id) {
        // Como não refatoramos AtuacaoMonitoria, ela permanece igual.
        // Fique de olho se ela também não causará circularidade no futuro!
        return atuacaoRepository.findByMonitoriaId(id);
    }

    // Buscar monitoria por usuário (para o monitor acessar a dele)
    @GetMapping("/monitor/{usuarioId}")
    public List<MonitoriaResponseDTO> buscarPorMonitor(@PathVariable Long usuarioId) {
        return monitoriaRepository.findByUsuarioId(usuarioId).stream()
                .map(monitoriaService::converterParaDTO)
                .collect(Collectors.toList());
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