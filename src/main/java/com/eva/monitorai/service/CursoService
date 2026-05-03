package com.eva.monitorai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eva.monitorai.dto.CursoDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.repository.CursoRepository;

// Service responsável pela lógica de negócio
@Service
public class CursoService {

    private final CursoRepository repository;

    public CursoService(CursoRepository repository) {
        this.repository = repository;
    }

    // Converte Entity para DTO
    private CursoDTO toDTO(Curso curso) {
        return new CursoDTO(
            curso.getId(),
            curso.getNome(),
            curso.getCodigo()
        );
    }

    // Converte DTO para Entity
    private Curso toEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setId(dto.getId());
        curso.setNome(dto.getNome());
        return curso;
    }

    // Gera o código automaticamente baseado no nome
    private String gerarCodigo(String nome) {

        if (nome == null || nome.trim().isEmpty()) {
            throw new RuntimeException("Nome do curso é obrigatório");
        }

        // Remove espaços e garante pelo menos 3 caracteres
        String nomeLimpo = nome.replaceAll("\\s+", "");

        String prefixo = nomeLimpo
                .substring(0, Math.min(3, nomeLimpo.length()))
                .toUpperCase();

        int numero = 1;
        String codigo;

        // Gera códigos até encontrar um que não existe no banco
        do {
            codigo = prefixo + String.format("%03d", numero);
            numero++;
        } while (repository.existsByCodigo(codigo));

        return codigo;
    }

    // Lista todos os cursos
    public List<CursoDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Busca curso por ID
    public CursoDTO buscarPorId(Long id) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        return toDTO(curso);
    }

    // Cria um novo curso
    public CursoDTO criar(CursoDTO dto) {

        if (repository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Já existe um curso com esse nome");
        }

        Curso curso = toEntity(dto);

        // Gera código automaticamente
        curso.setCodigo(gerarCodigo(dto.getNome()));

        return toDTO(repository.save(curso));
    }

    // Atualiza um curso existente
    public CursoDTO atualizar(Long id, CursoDTO dto) {

        Curso curso = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        curso.setNome(dto.getNome());

        return toDTO(repository.save(curso));
    }

    // Remove um curso
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
