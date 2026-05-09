package com.eva.monitorai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.model.entity.Disciplina;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.repository.UsuarioRepository;

@Service
public class DisciplinaService {

    private final DisciplinaRepository repository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;

    public DisciplinaService(
            DisciplinaRepository repository,
            CursoRepository cursoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // =====================================
    // ENTITY -> DTO
    // =====================================

    private DisciplinaDTO toDTO(Disciplina disciplina) {

        Long cursoId = disciplina.getCurso().getId();
        String cursoNome = disciplina.getCurso().getNome();
        Long monitorId = disciplina.getMonitor() != null ? disciplina.getMonitor().getId() : null;
        String monitorNome = disciplina.getMonitor() != null ? disciplina.getMonitor().getUsername() : null;

        DisciplinaDTO dto = new DisciplinaDTO(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.getCodigo(),
                cursoId,
                monitorId
        );
        
        dto.setCursoNome(cursoNome); 
        dto.setMonitorNome(monitorNome);

        return dto;
    }

    // =====================================
    // DTO -> ENTITY
    // =====================================

    private Disciplina toEntity(DisciplinaDTO dto) {

        Disciplina disciplina = new Disciplina();

        disciplina.setId(dto.getId());
        disciplina.setNome(dto.getNome());
        disciplina.setCodigo(dto.getCodigo());

        // CURSO (OBRIGATÓRIO)
        Curso curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new RuntimeException("Curso é obrigatório e não foi encontrado"));

        disciplina.setCurso(curso);

        // MONITOR (OPCIONAL)
        if (dto.getMonitorId() != null) {
            Usuario monitor = usuarioRepository.findById(dto.getMonitorId())
                    .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));
            disciplina.setMonitor(monitor);
        }

        return disciplina;
    }

    // =====================================
    // LISTAR TODOS
    // =====================================

    public List<DisciplinaDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // BUSCAR POR ID
    // =====================================

    public DisciplinaDTO buscarPorId(Long id) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        return toDTO(disciplina);
    }

    // =====================================
    // CRIAR
    // =====================================

    public DisciplinaDTO criar(DisciplinaDTO dto) {
        if (repository.existsByCodigo(dto.getCodigo())) {
            throw new RuntimeException("Já existe uma disciplina com esse código");
        }

        Disciplina disciplina = toEntity(dto);
        Disciplina salva = repository.save(disciplina);
        return toDTO(salva);
    }

    // =====================================
    // ATUALIZAR
    // =====================================

    public DisciplinaDTO atualizar(Long id, DisciplinaDTO dto) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        disciplina.setNome(dto.getNome());
        disciplina.setCodigo(dto.getCodigo());

        if (dto.getCursoId() != null) {
            Curso curso = cursoRepository.findById(dto.getCursoId())
                    .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
            disciplina.setCurso(curso);
        }

        if (dto.getMonitorId() != null) {
            Usuario monitor = usuarioRepository.findById(dto.getMonitorId())
                    .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));
            disciplina.setMonitor(monitor);
        }

        Disciplina atualizada = repository.save(disciplina);
        return toDTO(atualizada);
    }

    // =====================================
    // DELETAR
    // =====================================

    public void deletar(Long id) {
        repository.deleteById(id);
    }
    
    public List<Usuario> listarMonitores() {
        // Busca todos os usuários com role de monitor
        // Se não tiver o método findByRole, faz assim:
        return usuarioRepository.findAll().stream()
            .filter(u -> "MONITOR".equals(u.getRole()))
            .collect(Collectors.toList());
    }
}