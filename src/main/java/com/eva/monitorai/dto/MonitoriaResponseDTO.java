package com.eva.monitorai.dto;

import java.time.LocalTime;
import java.util.List;

public class MonitoriaResponseDTO {
    private Long id;
    private Long monitorId;
    private String monitorNome; // Apenas o nome, não o objeto Monitor inteiro
    private String disciplinaNome; // Apenas o nome da disciplina
    private String diaSemana;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;
    private String sala;
    private boolean ativa;
    private Long disciplinaId; // Faltava isso para o redirecionamento
    private String disciplinaCodigo; // Vi no seu front que vc usa o código da disciplina
    private List<String> cursosNomes; // Faltava para listar os cursos
    
	public MonitoriaResponseDTO() {
		super();
	}
	
	

	



	public MonitoriaResponseDTO(Long id, Long monitorId, String monitorNome, String disciplinaNome, String diaSemana,
			LocalTime horarioInicio, LocalTime horarioFim, String sala, boolean ativa, Long disciplinaId,
			String disciplinaCodigo, List<String> cursosNomes) {
		super();
		this.id = id;
		this.monitorId = monitorId;
		this.monitorNome = monitorNome;
		this.disciplinaNome = disciplinaNome;
		this.diaSemana = diaSemana;
		this.horarioInicio = horarioInicio;
		this.horarioFim = horarioFim;
		this.sala = sala;
		this.ativa = ativa;
		this.disciplinaId = disciplinaId;
		this.disciplinaCodigo = disciplinaCodigo;
		this.cursosNomes = cursosNomes;
	}







	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMonitorNome() {
		return monitorNome;
	}

	public void setMonitorNome(String monitorNome) {
		this.monitorNome = monitorNome;
	}

	public String getDisciplinaNome() {
		return disciplinaNome;
	}

	public void setDisciplinaNome(String disciplinaNome) {
		this.disciplinaNome = disciplinaNome;
	}

	public String getDiaSemana() {
		return diaSemana;
	}

	public void setDiaSemana(String diaSemana) {
		this.diaSemana = diaSemana;
	}

	public LocalTime getHorarioInicio() {
		return horarioInicio;
	}

	public void setHorarioInicio(LocalTime horarioInicio) {
		this.horarioInicio = horarioInicio;
	}

	public LocalTime getHorarioFim() {
		return horarioFim;
	}

	public void setHorarioFim(LocalTime horarioFim) {
		this.horarioFim = horarioFim;
	}

	public String getSala() {
		return sala;
	}

	public void setSala(String sala) {
		this.sala = sala;
	}

	public boolean isAtiva() {
		return ativa;
	}

	public void setAtiva(boolean ativa) {
		this.ativa = ativa;
	}

	public Long getDisciplinaId() {
		return disciplinaId;
	}

	public void setDisciplinaId(Long disciplinaId) {
		this.disciplinaId = disciplinaId;
	}

	public String getDisciplinaCodigo() {
		return disciplinaCodigo;
	}

	public void setDisciplinaCodigo(String disciplinaCodigo) {
		this.disciplinaCodigo = disciplinaCodigo;
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

	
    
}