package com.eva.monitorai.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.model.entity.Disciplina;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.repository.UsuarioRepository;

/**
 * Service responsável pela lógica de negócios e gerenciamento das Disciplinas.
 * Gerencia o ciclo de vida e o mapeamento Muitos-para-Muitos entre Cursos e Disciplinas.
 */
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

    // =========================================================================
    // CONVERSORES (MAPPERS)
    // =========================================================================

    /**
     * Converte uma Entidade Disciplina para seu respectivo DisciplinaDTO.
     * Delega a carga pesada para o construtor inteligente do DTO.
     */
    private DisciplinaDTO toDTO(Disciplina disciplina) {
        return new DisciplinaDTO(disciplina);
    }

    /**
     * Converte um DisciplinaDTO para a Entidade Disciplina.
     * Realiza a validação e o carregamento seguro das entidades associadas (Curso e Monitor).
     */
    private Disciplina toEntity(DisciplinaDTO dto) {
        Disciplina disciplina = new Disciplina();
        disciplina.setId(dto.getId());
        disciplina.setNome(dto.getNome());
        disciplina.setCodigo(dto.getCodigo());

        // Processamento Seguro dos Cursos Associados (Obrigatório ao menos 1)
        if (dto.getCursosIds() == null || dto.getCursosIds().isEmpty()) {
            throw new RuntimeException("Pelo menos um curso deve ser informado para a disciplina.");
        }

        // Busca todos os cursos selecionados no banco e injeta na entidade como um Set
        List<Curso> cursosBuscados = cursoRepository.findAllById(dto.getCursosIds());
        if (cursosBuscados.isEmpty()) {
            throw new RuntimeException("Nenhum curso válido foi encontrado para os IDs informados.");
        }

        Set<Curso> cursosSet = new HashSet<>(cursosBuscados);
        disciplina.setCursos(cursosSet);

        // Processamento do Monitor Associado (Opcional)
        if (dto.getMonitorId() != null) {
            Usuario monitor = usuarioRepository.findById(dto.getMonitorId())
                    .orElseThrow(() -> new RuntimeException("Monitor não encontrado com o ID fornecido."));
            disciplina.setMonitor(monitor);
        }

        return disciplina;
    }

    // =========================================================================
    // OPERAÇÕES DO CRUD
    // =========================================================================

    /**
     * Retorna a lista de todas as disciplinas cadastradas no sistema.
     */
    @Transactional(readOnly = true)
    public List<DisciplinaDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca uma disciplina específica utilizando seu identificador único (ID).
     */
    @Transactional(readOnly = true)
    public DisciplinaDTO buscarPorId(Long id) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada com o ID: " + id));
        return toDTO(disciplina);
    }

    /**
     * Salva uma nova disciplina no banco de dados.
     * O código identificador é tratado automaticamente se omitido.
     */
    
    @Transactional
    public DisciplinaDTO criar(DisciplinaDTO dto) {
        if (dto.getCodigo() != null && repository.existsByCodigo(dto.getCodigo())) {
            throw new RuntimeException("Já existe uma disciplina cadastrada com esse código.");
        }

        // Converte o DTO para Entity carregando os cursos do banco
        Disciplina disciplina = toEntity(dto);
        
        // Força o salvamento na tabela intermediária (disciplina_curso)
        if (disciplina.getCursos() != null) {
            disciplina.getCursos().forEach(curso -> {
                if (!curso.getDisciplinas().contains(disciplina)) {
                    curso.getDisciplinas().add(disciplina);
                }
            });
        }

        Disciplina salva = repository.save(disciplina);
        return toDTO(salva);
    }

    /**
     * Atualiza os dados de uma disciplina existente.
     * Substitui completamente a lista anterior de cursos associados de forma segura.
     */
    @Transactional
    public DisciplinaDTO atualizar(Long id, DisciplinaDTO dto) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada para atualização."));

        disciplina.setNome(dto.getNome());

        // Atualização da relação Muitos-para-Muitos com Cursos
        if (dto.getCursosIds() != null && !dto.getCursosIds().isEmpty()) {
            List<Curso> novosCursos = cursoRepository.findAllById(dto.getCursosIds());
            
            // Remove as referências antigas para evitar inconsistências
            disciplina.getCursos().forEach(curso -> curso.getDisciplinas().remove(disciplina));
            disciplina.getCursos().clear();

            // Atribui os novos cursos atualizados
            novosCursos.forEach(disciplina::adicionarCurso);
        }

        // Atualização da relação de Monitoria
        if (dto.getMonitorId() != null) {
            Usuario monitor = usuarioRepository.findById(dto.getMonitorId())
                    .orElseThrow(() -> new RuntimeException("Monitor não encontrado."));
            disciplina.setMonitor(monitor);
        } else {
            disciplina.setMonitor(null); // Remove monitor se desvinculado no Front
        }

        Disciplina atualizada = repository.save(disciplina);
        return toDTO(atualizada);
    }

    /**
     * Remove uma disciplina do sistema através do seu ID.
     */
    @Transactional
    public void deletar(Long id) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada para exclusão."));
        
        // Remove os vínculos na tabela intermediária antes de deletar a entidade principal
        disciplina.getCursos().forEach(curso -> curso.getDisciplinas().remove(disciplina));
        
        repository.delete(disciplina);
    }

    // =========================================================================
    // CONSULTAS ADICIONAIS
    // =========================================================================

    /**
     * Filtra e lista todos os usuários que desempenham a Role de MONITOR.
     */
    @Transactional(readOnly = true)
    public List<Usuario> listarMonitores() {
        return usuarioRepository.findAll().stream()
                .filter(u -> "MONITOR".equals(u.getRole()))
                .collect(Collectors.toList());
    }

    /**
     * Recupera todas as disciplinas vinculadas a um curso específico.
     * Utilizado para alimentar a expansão dinâmica na tela de listagem de Cursos.
     */
    @Transactional(readOnly = true)
    public List<DisciplinaDTO> listarPorCurso(Long cursoId) {
        return repository.buscarPorCurso(cursoId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}