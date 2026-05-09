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

    // =========================================
    // CRIAR MONITORIA
    // =========================================

public Monitoria criarMonitoria(MonitoriaDTO dto) {

    // BUSCA USUÁRIO
    Usuario usuario = usuarioRepository.findById(dto.getMonitorId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    // BUSCA DISCIPLINA
    Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
            .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

    // PROMOVE PARA MONITOR
    usuario.setRole("MONITOR");

    usuarioRepository.save(usuario);

    // VERIFICA SE JÁ EXISTE MONITOR
    Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
            .orElse(null);

    // SE NÃO EXISTIR, CRIA
    if (monitor == null) {

        monitor = new Monitor();

        monitor.setUsuario(usuario);
        monitor.setDisciplina(disciplina);
        monitor.setAtivo(true);

        monitor = monitorRepository.save(monitor);
    }

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

    // =========================================
    // LISTAR TODAS
    // =========================================

    public List<Monitoria> listarTodas() {
        return monitoriaRepository.findAll();
    }

    // =========================================
    // BUSCAR POR ID
    // =========================================

    public Monitoria buscarPorId(Long id) {

        return monitoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));
    }

    // =========================================
    // LISTAR APENAS ATIVAS
    // =========================================

    public List<Monitoria> listarAtivas() {
        return monitoriaRepository.findByAtivaTrue();
    }

    // =========================================
    // ATUALIZAR MONITORIA
    // =========================================

public Monitoria atualizar(Long id, MonitoriaDTO dto) {

    Monitoria monitoria = buscarPorId(id);

    Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
            .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

    // =====================================
    // VERIFICA SE TROCOU O MONITOR
    // =====================================

    if (!monitoria.getMonitor().getUsuario().getId().equals(dto.getMonitorId())) {

        trocarMonitor(id, dto.getMonitorId());

        // Atualiza objeto após troca
        monitoria = buscarPorId(id);
    }

    // =====================================
    // ATUALIZA DADOS
    // =====================================

    monitoria.setDisciplina(disciplina);
    monitoria.setDiaSemana(dto.getDiaSemana());
    monitoria.setHorarioInicio(dto.getHorarioInicio());
    monitoria.setHorarioFim(dto.getHorarioFim());
    monitoria.setSala(dto.getSala());
    monitoria.setSemestreReferencia(dto.getSemestreReferencia());

    return monitoriaRepository.save(monitoria);
}

    // =========================================
    // DESATIVAR MONITORIA
    // =========================================

    public void deletar(Long id) {

        Monitoria monitoria = buscarPorId(id);

        monitoria.setAtiva(false);

        monitoriaRepository.save(monitoria);
    }

    // =========================================
    // TROCAR MONITOR
    // =========================================

    public Monitoria trocarMonitor(Long monitoriaId, Long novoUsuarioId) {

        // Busca monitoria
        Monitoria monitoria = monitoriaRepository.findById(monitoriaId)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));

        // =====================================
        // MONITOR ANTIGO
        // =====================================

        Monitor monitorAntigo = monitoria.getMonitor();

        Usuario usuarioAntigo = monitorAntigo.getUsuario();

        usuarioAntigo.setRole("ALUNO");

        usuarioRepository.save(usuarioAntigo);

        // =====================================
        // NOVO USUÁRIO
        // =====================================

        Usuario usuarioNovo = usuarioRepository.findById(novoUsuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuarioNovo.setRole("MONITOR");

        usuarioRepository.save(usuarioNovo);

        // =====================================
        // PROCURA MONITOR
        // =====================================

        Monitor novoMonitor = monitorRepository.findByUsuarioId(usuarioNovo.getId())
                .orElse(null);

        // =====================================
        // SE NÃO EXISTIR, CRIA
        // =====================================

        if (novoMonitor == null) {

            novoMonitor = new Monitor();

            novoMonitor.setUsuario(usuarioNovo);

            novoMonitor.setDisciplina(monitoria.getDisciplina());

            novoMonitor.setAtivo(true);

            novoMonitor = monitorRepository.save(novoMonitor);
        }

        // =====================================
        // ATUALIZA MONITORIA
        // =====================================

        monitoria.setMonitor(novoMonitor);

        return monitoriaRepository.save(monitoria);
    }
}