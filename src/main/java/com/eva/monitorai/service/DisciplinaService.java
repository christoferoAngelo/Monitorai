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
        disciplina.setSemestre(dto.getSemestre());

        // Processamento Seguro e flexível dos Cursos Associados
        if (dto.getCursosIds() != null && !dto.getCursosIds().isEmpty()) {
            List<Curso> cursosBuscados = cursoRepository.findAllById(dto.getCursosIds());
            if (!cursosBuscados.isEmpty()) {
                Set<Curso> cursosSet = new HashSet<>(cursosBuscados);
                disciplina.setCursos(cursosSet);
            }
        }

        // Processamento do Monitor Associado (Opcional)
        if (dto.getMonitorId() != null) {
            Usuario monitor = usuarioRepository.findById(dto.getMonitorId()).orElse(null);
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
        // 1. Validação defensiva do código da disciplina
        if (dto.getCodigo() != null && !dto.getCodigo().trim().isEmpty()) {
            if (repository.existsByCodigo(dto.getCodigo())) {
                throw new RuntimeException("Já existe uma disciplina cadastrada com esse código.");
            }
        }

        // 2. Instancia a Entidade básica
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(dto.getNome());
        disciplina.setCodigo(dto.getCodigo());
        disciplina.setSemestre(dto.getSemestre());
        
        // 3. VÍNCULO DOS CURSOS - PROTEGIDO CONTRA BUGS DE ID NULL (Onde dava o Erro 500)
        if (dto.getCursosIds() != null && !dto.getCursosIds().isEmpty()) {
            
            // Remove qualquer valor 'null' acidental que possa ter vindo na lista do JSX
            List<Long> idsValidos = dto.getCursosIds().stream()
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            // Só consulta o banco se a lista contiver IDs reais após a filtragem
            if (!idsValidos.isEmpty()) {
                List<Curso> cursosBuscados = cursoRepository.findAllById(idsValidos);
                if (!cursosBuscados.isEmpty()) {
                    disciplina.setCursos(new java.util.HashSet<>(cursosBuscados));
                }
            }
        }

        // 4. Vínculo com o Monitor (Opcional)
        if (dto.getMonitorId() != null) {
            usuarioRepository.findById(dto.getMonitorId()).ifPresent(disciplina::setMonitor);
        }

        // 5. Salva a disciplina de forma isolada
        Disciplina salva = repository.save(disciplina);

        // 6. Atualiza o lado inverso do relacionamento se houver cursos vinculados
        if (salva.getCursos() != null) {
            salva.getCursos().forEach(curso -> {
                if (!curso.getDisciplinas().contains(salva)) {
                    curso.getDisciplinas().add(salva);
                }
            });
        }

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

        disciplina.setNome(dto.getNome());
        disciplina.setSemestre(dto.getSemestre());  
        
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