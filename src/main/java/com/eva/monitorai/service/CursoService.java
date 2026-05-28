package com.eva.monitorai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eva.monitorai.dto.CursoDTO;
import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.model.entity.Disciplina;
import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;

@Service
public class CursoService {

    private final CursoRepository repository;
    private final DisciplinaRepository disciplinaRepository;

    public CursoService(CursoRepository repository, DisciplinaRepository disciplinaRepository) {
        this.repository = repository;
        this.disciplinaRepository = disciplinaRepository;
    }

    private CursoDTO toDTO(Curso curso) {
        return new CursoDTO(curso.getId(), curso.getNome(), curso.getCodigo());
    }

    private Curso toEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setId(dto.getId());
        curso.setNome(dto.getNome());
        return curso;
    }

    private String generarCodigo(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new RuntimeException("Nome do curso é obrigatório");
        }
        String nomeLimpo = nome.replaceAll("\\s+", "");
        String prefixo = nomeLimpo.substring(0, Math.min(3, nomeLimpo.length())).toUpperCase();
        int numero = 1;
        String codigo;
        do {
            codigo = prefixo + String.format("%03d", numero);
            numero++;
        } while (repository.existsByCodigo(codigo));
        return codigo;
    }

    @Transactional(readOnly = true)
    public List<CursoDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CursoDTO buscarPorId(Long id) {
        Curso curso = repository.findById(id).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        return toDTO(curso);
    }

    @Transactional(readOnly = true)
    public List<CursoDTO> filtrarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DisciplinaDTO> listarDisciplinasDoCurso(Long cursoId) {
        Curso curso = repository.findByIdComDisciplinas(cursoId).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        return curso.getDisciplinas().stream().map(DisciplinaDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CursoDTO criar(CursoDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Já existe um curso com esse nome");
        }
        Curso curso = toEntity(dto);
        curso.setCodigo(generarCodigo(dto.getNome()));
        return toDTO(repository.save(curso));
    }

    @Transactional
    public CursoDTO atualizar(Long id, CursoDTO dto) {
        Curso curso = repository.findById(id).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        curso.setNome(dto.getNome());
        return toDTO(repository.save(curso));
    }

    @Transactional
    public void deletar(Long id) {
        Curso curso = repository.findById(id).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        if (curso.getDisciplinas() != null) {
            curso.getDisciplinas().forEach(disciplina -> {
                if (disciplina.getCursos() != null) {
                    disciplina.getCursos().remove(curso);
                }
            });
            curso.getDisciplinas().clear();
        }
        repository.delete(curso);
    }

    @Transactional
    public void adicionarDisciplina(Long cursoId, Long disciplinaId) {
        Curso curso = repository.findById(cursoId).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId).orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        curso.getDisciplinas().add(disciplina);
        disciplina.getCursos().add(curso);
        repository.save(curso);
    }

    @Transactional
    public void removerDisciplina(Long cursoId, Long disciplinaId) {
        Curso curso = repository.findById(cursoId).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId).orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        curso.getDisciplinas().remove(disciplina);
        disciplina.getCursos().remove(curso);
        repository.save(curso);
    }
}