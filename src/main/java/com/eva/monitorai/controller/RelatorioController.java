package com.eva.monitorai.controller;

import com.eva.monitorai.dto.RelatorioMonitoriaDTO;
import com.eva.monitorai.model.entity.RelatorioMonitoria;
import com.eva.monitorai.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/relatorios")
@CrossOrigin("*") // ADICIONADO: Igualzinho ao MonitoriaController
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    // REMOVIDO o @PreAuthorize daqui. A segurança ficará só na SecurityConfig
    @PostMapping
    public ResponseEntity<RelatorioMonitoria> salvar(@RequestBody RelatorioMonitoriaDTO dto) {
        return ResponseEntity.ok(relatorioService.salvar(dto));
    }

    @GetMapping("/monitoria/{id}")
    public ResponseEntity<List<RelatorioMonitoria>> listarPorMonitoria(@PathVariable Long id) {
        return ResponseEntity.ok(relatorioService.listarHistorico(id));
    }

    @GetMapping
    public ResponseEntity<List<RelatorioMonitoria>> listarTodos() {
        return ResponseEntity.ok(relatorioService.listarTodos());
    }
    
    @GetMapping("/monitoria/{id}/media")
    public ResponseEntity<Double> mediaAlunos(@PathVariable Long id) {
        return ResponseEntity.ok(relatorioService.calcularMediaAlunos(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        relatorioService.excluir(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RelatorioMonitoria> atualizar(
            @PathVariable Long id, 
            @RequestBody RelatorioMonitoriaDTO dto) {
        return ResponseEntity.ok(relatorioService.atualizar(id, dto));
    }
}