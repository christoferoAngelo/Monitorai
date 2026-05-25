package com.eva.monitorai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eva.monitorai.dto.RelatorioMonitoriaDTO;
import com.eva.monitorai.model.entity.Monitoria;
import com.eva.monitorai.model.entity.RelatorioMonitoria;
import com.eva.monitorai.repository.MonitoriaRepository;
import com.eva.monitorai.repository.RelatorioRepository;

@Service
public class RelatorioService {
    @Autowired
    private RelatorioRepository relatorioRepository;
    @Autowired
    private MonitoriaRepository monitoriaRepository;
    
    

    public RelatorioMonitoria salvar(RelatorioMonitoriaDTO dto) {
        // 1. Busca a monitoria no banco (essencial para o relacionamento JPA)
        Monitoria monitoria = monitoriaRepository.findById(dto.getMonitoriaId())
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));

        // 2. Converte DTO para Entity
        RelatorioMonitoria relatorio = new RelatorioMonitoria();
        relatorio.setMonitoria(monitoria);
        relatorio.setData(dto.getData());
        relatorio.setQuantidadeAlunos(dto.getQuantidadeAlunos());
        relatorio.setConteudoAbordado(dto.getConteudoAbordado());
        relatorio.setObservacoes(dto.getObservacoes());

        // 3. Salva
        return relatorioRepository.save(relatorio);
    }

    public List<RelatorioMonitoria> listarHistorico(Long monitoriaId) {
        return relatorioRepository.findByMonitoriaId(monitoriaId);
    }

    public List<RelatorioMonitoria> listarTodos() {
        return relatorioRepository.findAll();
    }

    // Calcula a média de alunos para o Admin
    public Double calcularMediaAlunos(Long monitoriaId) {
        List<RelatorioMonitoria> relatorios = relatorioRepository.findByMonitoriaId(monitoriaId);
        return relatorios.stream()
                .mapToInt(RelatorioMonitoria::getQuantidadeAlunos)
                .average()
                .orElse(0.0);
    }
    
    public void excluir(Long id) {
        relatorioRepository.deleteById(id);
    }
    
    public RelatorioMonitoria atualizar(Long id, RelatorioMonitoriaDTO dto) {
        RelatorioMonitoria relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado"));
        
        relatorio.setData(dto.getData());
        relatorio.setQuantidadeAlunos(dto.getQuantidadeAlunos());
        relatorio.setConteudoAbordado(dto.getConteudoAbordado());
        relatorio.setObservacoes(dto.getObservacoes());
        
        return relatorioRepository.save(relatorio);
    }
}