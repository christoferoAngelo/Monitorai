package com.eva.monitorai.service;

import com.eva.monitorai.dto.EditalDTO;
import com.eva.monitorai.model.entity.Edital;
import com.eva.monitorai.repository.EditalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EditalService {

    @Autowired
    private EditalRepository repository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Listar todos os editais
    public List<EditalDTO> listarTodos() {
        return repository.findAllByOrderByDataPublicacaoDesc()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // Listar só os ativos (para a home)
    public List<EditalDTO> listarAtivos() {
        return repository.findByStatus("ATIVO")
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public EditalDTO buscarPorId(Long id) {
        Edital edital = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Edital não encontrado"));
        return converterParaDTO(edital);
    }

    // Criar novo edital - automático encerra o anterior do mesmo tipo
    public EditalDTO criar(EditalDTO dto) {
        // 🔥 BUSCA O EDITAL ATIVO DO MESMO TIPO E ENCERRA
    	repository.findByStatusAndTipo("ATIVO", dto.getTipo())
        .forEach(ativo -> {
            ativo.setStatus("ENCERRADO");
            repository.save(ativo);
        });
        Edital edil = new Edital();
        
        edil.setTitulo(dto.getTitulo());
        edil.setDescricao(dto.getDescricao());
        edil.setTipo(dto.getTipo());
        edil.setNumeroEdital(dto.getNumeroEdital());
        edil.setStatus("ATIVO"); // Sempre ativo por padrão
        edil.setDataPublicacao(LocalDateTime.now());
        
        edil.setPeriodoInicio(dto.getPeriodoInicio());
        edil.setPeriodoFim(dto.getPeriodoFim());
        
        edil.setUrlPdf(dto.getUrlPdf());
        edil.setNomeArquivo(dto.getNomeArquivo());
        edil.setTipoArquivo(dto.getTipoArquivo());
        edil.setTamanhoArquivo(dto.getTamanhoArquivo());
        
        Edital salvo = repository.save(edil);
        return converterParaDTO(salvo);
    }

    // Atualizar edital
    public EditalDTO atualizar(Long id, EditalDTO dto) {
        Edital edil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Edital não encontrado"));
        
        edil.setTitulo(dto.getTitulo());
        edil.setDescricao(dto.getDescricao());
        edil.setTipo(dto.getTipo());
        edil.setNumeroEdital(dto.getNumeroEdital());
        edil.setStatus(dto.getStatus());
        
        edil.setPeriodoInicio(dto.getPeriodoInicio());
        edil.setPeriodoFim(dto.getPeriodoFim());
        
        if (dto.getUrlPdf() != null) {
            edil.setUrlPdf(dto.getUrlPdf());
            edil.setNomeArquivo(dto.getNomeArquivo());
            edil.setTipoArquivo(dto.getTipoArquivo());
            edil.setTamanhoArquivo(dto.getTamanhoArquivo());
        }
        
        Edital atualizado = repository.save(edil);
        return converterParaDTO(atualizado);
    }

    // Excluir edital
    public void excluir(Long id) {
        Edital edil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Edital não encontrado"));
        
        repository.delete(edil);
    }

    // Converter Entity para DTO
    private EditalDTO converterParaDTO(Edital edil) {
        EditalDTO dto = new EditalDTO();
        
        dto.setId(edil.getId());
        dto.setTitulo(edil.getTitulo());
        dto.setDescricao(edil.getDescricao());
        dto.setTipo(edil.getTipo());
        dto.setNumeroEdital(edil.getNumeroEdital());
        dto.setStatus(edil.getStatus());
        
        if (edil.getDataPublicacao() != null) {
            dto.setDataPublicacao(edil.getDataPublicacao().format(formatter));
        }
        
        dto.setPeriodoInicio(edil.getPeriodoInicio());
        dto.setPeriodoFim(edil.getPeriodoFim());
        
        dto.setUrlPdf(edil.getUrlPdf());
        dto.setNomeArquivo(edil.getNomeArquivo());
        dto.setTipoArquivo(edil.getTipoArquivo());
        dto.setTamanhoArquivo(edil.getTamanhoArquivo());
        
        return dto;
    }
}