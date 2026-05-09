package com.eva.monitorai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eva.monitorai.dto.MonitoriaDTO;
import com.eva.monitorai.model.entity.Disciplina;
import com.eva.monitorai.model.entity.Monitor;
import com.eva.monitorai.model.entity.Monitoria;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.repository.MonitorRepository;
import com.eva.monitorai.repository.MonitoriaRepository;
import com.eva.monitorai.repository.UsuarioRepository;

@Service
public class MonitoriaService {

    @Autowired
    private MonitoriaRepository monitoriaRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Criar monitoria
    public Monitoria criarMonitoria(MonitoriaDTO dto) {

        Monitor monitor = monitorRepository.findById(dto.getMonitorId())
                .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        // PROMOVE usuário para ROLE_MONITOR
        Usuario usuario = monitor.getUsuario();

        usuario.setRole("ROLE_MONITOR");

        usuarioRepository.save(usuario);

        // CRIA MONITORIA
        Monitoria monitoria = new Monitoria();

        monitoria.setMonitor(monitor);
        monitoria.setDisciplina(disciplina);
        monitoria.setDiaSemana(dto.getDiaSemana());
        monitoria.setHorarioInicio(dto.getHorarioInicio());
        monitoria.setHorarioFim(dto.getHorarioFim());
        monitoria.setSala(dto.getSala());
        monitoria.setSemestreReferencia(dto.getSemestreReferencia());
        monitoria.setAtiva(true);

        return monitoriaRepository.save(monitoria);
    }
    // Listar todas
    public List<Monitoria> listarTodas() {
        return monitoriaRepository.findAll();
    }

    // Buscar por ID
    public Monitoria buscarPorId(Long id) {
        return monitoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));
    }

    // Deletar
    public void deletar(Long id) {
        monitoriaRepository.deleteById(id);
    }

    // Listar ativas
    public List<Monitoria> listarAtivas() {
        return monitoriaRepository.findByAtivaTrue();
    }

    // Atualizar
    public Monitoria atualizar(Long id, MonitoriaDTO dto) {

        Monitoria monitoria = buscarPorId(id);

        Monitor monitor = monitorRepository.findById(dto.getMonitorId())
                .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        monitoria.setMonitor(monitor);
        monitoria.setDisciplina(disciplina);
        monitoria.setDiaSemana(dto.getDiaSemana());
        monitoria.setHorarioInicio(dto.getHorarioInicio());
        monitoria.setHorarioFim(dto.getHorarioFim());
        monitoria.setSala(dto.getSala());
        monitoria.setSemestreReferencia(dto.getSemestreReferencia());

        return monitoriaRepository.save(monitoria);
    }
    
    public Monitoria trocarMonitor(Long monitoriaId, Long novoMonitorId) {

        // Busca monitoria
        Monitoria monitoria = monitoriaRepository.findById(monitoriaId)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));

        // Monitor antigo
        Monitor monitorAntigo = monitoria.getMonitor();

        // Novo monitor
        Monitor novoMonitor = monitorRepository.findById(novoMonitorId)
                .orElseThrow(() -> new RuntimeException("Novo monitor não encontrado"));

        // REBAIXA monitor antigo
        Usuario usuarioAntigo = monitorAntigo.getUsuario();

        usuarioAntigo.setRole("ROLE_ALUNO");

        usuarioRepository.save(usuarioAntigo);

        // PROMOVE novo monitor

        Usuario usuarioNovo = novoMonitor.getUsuario();

        usuarioNovo.setRole("ROLE_MONITOR");

        usuarioRepository.save(usuarioNovo);

        // ATUALIZA MONITORIA

        monitoria.setMonitor(novoMonitor);

        return monitoriaRepository.save(monitoria);
    }
}