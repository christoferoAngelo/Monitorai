package com.eva.monitorai.dto;

import com.eva.monitorai.model.entity.Disciplina;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Objeto de Transferência de Dados (DTO) para a entidade Disciplina.
 * Utilizado para trafegar dados de forma segura entre o Backend e o Frontend,
 * evitando problemas de carregamento preguiçoso (Lazy) e recursão cíclica do JSON.
 */
public class DisciplinaDTO {

    private Long id;
    private String nome;
    private String codigo;
    private List<Long> cursosIds;      // IDs dos cursos vinculados (para lógica/edição no Front)
    private List<String> cursosNomes;  // Nomes dos cursos vinculados (para exibição na listagem)
    private Long monitorId;
    private String monitorNome;
    private Integer semestre;

    // =========================================================================
    // CONSTRUTORES
    // =========================================================================

    /**
     * Construtor padrão necessário para frameworks de serialização (como o Jackson).
     */
    public DisciplinaDTO() {
    }

    /**
     * Construtor completo para criação manual ou testes unitários.
     */
    public DisciplinaDTO(Long id, String nome, String codigo, List<Long> cursosIds, List<String> cursosNomes, Long monitorId, String monitorNome, Integer semestre) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.cursosIds = cursosIds;
        this.cursosNomes = cursosNomes;
        this.monitorId = monitorId;
        this.monitorNome = monitorNome;
        this.semestre = semestre;

    }

    /**
     * Construtor de Conversão (Entity para DTO).
     * Mapeia com segurança a Entidade Disciplina extraindo apenas os dados necessários,
     * quebrando qualquer possibilidade de loop infinito de referências circulares.
     */
    public DisciplinaDTO(Disciplina disciplina) {
        this.id = disciplina.getId();
        this.nome = disciplina.getNome();
        this.codigo = disciplina.getCodigo();
        this.semestre = disciplina.getSemestre(); 
        
        // Mapeamento Seguro da relação Muitos-para-Muitos com Curso
        if (disciplina.getCursos() != null) {
            // Extrai apenas os IDs dos cursos vinculados
            this.cursosIds = disciplina.getCursos().stream()
                    .map(curso -> curso.getId())
                    .collect(Collectors.toList());

            // Extrai apenas os nomes dos cursos vinculados
            this.cursosNomes = disciplina.getCursos().stream()
                    .map(curso -> curso.getNome())
                    .collect(Collectors.toList());
        }

        // Mapeamento Seguro da relação com o Monitor (Usuário)
        if (disciplina.getMonitor() != null) {
            this.monitorId = disciplina.getMonitor().getId();
          this.monitorNome = disciplina.getMonitor().getUsername(); // Supondo que a entidade Usuario tenha getNome()
        }
    }

    // =========================================================================
    // GETTERS E SETTERS
    // =========================================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public List<Long> getCursosIds() {
        return cursosIds;
    }

    public void setCursosIds(List<Long> cursosIds) {
        this.cursosIds = cursosIds;
    }

    public List<String> getCursosNomes() {
        return cursosNomes;
    }

    public void setCursosNomes(List<String> cursosNomes) {
        this.cursosNomes = cursosNomes;
    }

    public Long getMonitorId() {
        return monitorId;
    }

    public void setMonitorId(Long monitorId) {
        this.monitorId = monitorId;
    }

    public String getMonitorNome() {
        return monitorNome;
    }

    public void setMonitorNome(String monitorNome) {
        this.monitorNome = monitorNome;
    }
    
    public Integer getSemestre() {
        return semestre;
    }

    public void setSemestre(Integer semestre) {
        this.semestre = semestre;
    }
}