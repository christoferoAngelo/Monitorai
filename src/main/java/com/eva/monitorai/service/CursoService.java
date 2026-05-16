package com.eva.monitorai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eva.monitorai.dto.CursoDTO;
import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.repository.CursoRepository;

/**
 * Service responsável pela regra de negócios e gerenciamento da entidade Curso.
 */
@Service
public class CursoService {

    private final CursoRepository repository;

    public CursoService(CursoRepository repository) {
        this.repository = repository;
    }

    // =========================================================================
    // MAPPERS (CONVERSORES)
    // =========================================================================
    
    private CursoDTO toDTO(Curso curso) {
        return new CursoDTO(
            curso.getId(),
            curso.getNome(),
            curso.getCodigo()
        );
    }

    private Curso toEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setId(dto.getId());
        curso.setNome(dto.getNome());
        return curso;
    }

    // Algoritmo interno para geração de chaves de curso únicos
    private String generarCodigo(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new RuntimeException("Nome do curso é obrigatório");
        }

        String nomeLimpo = nome.replaceAll("\\s+", "");
        String prefixo = nomeLimpo
                .substring(0, Math.min(3, nomeLimpo.length()))
                .toUpperCase();

        int numero = 1;
        String codigo;

        do {
            codigo = prefixo + String.format("%03d", numero);
            numero++;
        } while (repository.existsByCodigo(codigo));

        return codigo;
    }

    // =========================================================================
    // CONSULTAS (READ-ONLY)
    // =========================================================================

    @Transactional(readOnly = true)
    public List<CursoDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CursoDTO buscarPorId(Long id) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o ID: " + id));
        return toDTO(curso);
    }

    @Transactional(readOnly = true)
    public List<CursoDTO> filtrarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<DisciplinaDTO> listarDisciplinasDoCurso(Long cursoId) {
        Curso curso = repository.findByIdComDisciplinas(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        return curso.getDisciplinas().stream()
                .map(DisciplinaDTO::new)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // OPERAÇÕES DE ESCRITA (MUTATION)
    // =========================================================================

    @Transactional
    public CursoDTO criar(CursoDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Já existe um curso com esse nome");
        }

        Curso curso = toEntity(dto);

        // Mudamos aqui para botar o "ne" igualzinho está na sua função original
        curso.setCodigo(generarCodigo(dto.getNome())); 

        return toDTO(repository.save(curso));
    }

    @Transactional
    public CursoDTO atualizar(Long id, CursoDTO dto) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        curso.setNome(dto.getNome());
        return toDTO(repository.save(curso));
    }

    /**
     * Remove o curso de maneira segura garantindo que as tabelas de associação 
     * não causem violação de integridade referencial ou erros de commit tardio.
     */
    @Transactional
    public void deletar(Long id) {
        Curso curso = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        // Se houver disciplinas vinculadas, limpa a relação antes de excluir
        if (curso.getDisciplinas() != null) {
            // Remove a relação nos dois lados da coleção gerenciada pelo Hibernate
            curso.getDisciplinas().forEach(disciplina -> {
                if (disciplina.getCursos() != null) {
                    disciplina.getCursos().remove(curso);
                }
            });
            curso.getDisciplinas().clear();
        }

        repository.delete(curso);
    }
}