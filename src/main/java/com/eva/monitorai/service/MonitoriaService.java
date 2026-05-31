package com.eva.monitorai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eva.monitorai.dto.MonitoriaDTO;
import com.eva.monitorai.model.entity.Disciplina;
import com.eva.monitorai.model.entity.Monitor;
import com.eva.monitorai.model.entity.Monitoria;
import com.eva.monitorai.model.entity.AtuacaoMonitoria;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.AtuacaoMonitoriaRepository;
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

    @Autowired
    private AtuacaoMonitoriaRepository atuacaoRepository;

    // =========================================
    // FUNÇÃO AUXILIAR: CALCULAR SEMESTRE
    // =========================================
    private String calcularSemestreAtual() {
        LocalDate hoje = LocalDate.now();
        int ano = hoje.getYear();
        int semestre = hoje.getMonthValue() <= 6 ? 1 : 2;
        return ano + "/" + semestre;
    }

    // =========================================
    // CRIAR MONITORIA
    // =========================================
    @Transactional
    public Monitoria criarMonitoria(MonitoriaDTO dto) {

        // 🛑 REGRA 1: Validação de Horário
        if (!dto.getHorarioInicio().isBefore(dto.getHorarioFim())) {
            throw new RuntimeException("O horário de início deve ser menor que o horário de término.");
        }
        
        List<Monitoria> conflitos = monitoriaRepository.buscarConflitosDeSala(
                dto.getSala(), 
                dto.getDiaSemana(), 
                dto.getHorarioInicio(), 
                dto.getHorarioFim()
            );

        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Já existe uma monitoria agendada para a sala " + dto.getSala() + 
                                       " neste dia e horário.");
        }

        Usuario usuario = usuarioRepository.findById(dto.getMonitorId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        
        // 🛑 REGRA 4: Não permitir duplicar monitoria (mesma disciplina + ativa)
        List<Monitoria> mesmaDisciplina = monitoriaRepository.buscarMonitoriaAtivaDaDisciplina(dto.getDisciplinaId());
        if (!mesmaDisciplina.isEmpty()) {
            throw new RuntimeException("Já existe uma monitoria ativa para a disciplina '" + disciplina.getNome() + 
                "'. Para criar uma nova, inative a monitoria atual primeiro.");
        }

        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId()).orElse(null);

        // 🛑 REGRA 2: Bloquear aluno em múltiplas monitorias
        if (monitor != null) {
            boolean jaTemMonitoriaAtiva = monitoriaRepository.findByMonitorId(monitor.getId())
                    .stream()
                    .anyMatch(Monitoria::isAtiva);

            if (jaTemMonitoriaAtiva) {
                throw new RuntimeException("Este aluno já possui uma monitoria ativa. O edital não permite acúmulo de bolsas.");
            }
        } else {
            monitor = new Monitor();
            monitor.setUsuario(usuario);
            monitor.setDisciplina(disciplina);
            monitor.setAtivo(true);
            monitor = monitorRepository.save(monitor);
            
            usuario.setRole("MONITOR");
            usuarioRepository.save(usuario);
        }

        Monitoria monitoria = new Monitoria();
        monitoria.setMonitor(monitor);
        monitoria.setDisciplina(disciplina);
        monitoria.setDiaSemana(dto.getDiaSemana());
        monitoria.setHorarioInicio(dto.getHorarioInicio());
        monitoria.setHorarioFim(dto.getHorarioFim());
        monitoria.setSala(dto.getSala());
        
        // 🛑 REGRA 3: Semestre Automático
        monitoria.setSemestreReferencia(calcularSemestreAtual());
        monitoria.setAtiva(true);

        // Salva a monitoria primeiro
        monitoria = monitoriaRepository.save(monitoria);
        
        // CRIA A ATUAÇÃO
        AtuacaoMonitoria atuacao = new AtuacaoMonitoria();
        atuacao.setMonitoria(monitoria);
        atuacao.setMonitor(monitor);
        atuacao.setDataInicio(LocalDate.now());
        atuacao.setAtiva(true);
        atuacaoRepository.save(atuacao);

        return monitoria;
    }

    // =========================================
    // ATUALIZAR MONITORIA
    // =========================================
    @Transactional
    public Monitoria atualizar(Long id, MonitoriaDTO dto) {
        Monitoria monitoria = buscarPorId(id);

        // Validação de Horário
        if (!dto.getHorarioInicio().isBefore(dto.getHorarioFim())) {
            throw new RuntimeException("O horário de início deve ser menor que o horário de término.");
        }
        
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        // VERIFICA SE TROCOU O MONITOR
        if (!monitoria.getMonitor().getUsuario().getId().equals(dto.getMonitorId())) {
            trocarMonitor(id, dto.getMonitorId());
            monitoria = buscarPorId(id);
        }
        
        List<Monitoria> conflitos = monitoriaRepository.buscarConflitosDeSalaExcetoId(
                dto.getSala(), 
                dto.getDiaSemana(), 
                dto.getHorarioInicio(), 
                dto.getHorarioFim(),
                id
            );

        // ATUALIZA DADOS
        monitoria.setDisciplina(disciplina);
        monitoria.setDiaSemana(dto.getDiaSemana());
        monitoria.setHorarioInicio(dto.getHorarioInicio());
        monitoria.setHorarioFim(dto.getHorarioFim());
        monitoria.setSala(dto.getSala());

        return monitoriaRepository.save(monitoria);
    }

    public Monitoria buscarPorId(Long id) {
        return monitoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));
    }

    public List<Monitoria> listarAtivas() {
        return monitoriaRepository.findByAtivaTrue();
    }

    @Transactional
    public void deletar(Long id) {
        Monitoria monitoria = buscarPorId(id);
        monitoria.setAtiva(false);
        monitoriaRepository.save(monitoria);
    }

    // =========================================
    // TROCAR MONITOR
    // =========================================
    @Transactional
    public Monitoria trocarMonitor(Long monitoriaId, Long novoUsuarioId) {
        Monitoria monitoria = monitoriaRepository.findById(monitoriaId)
                .orElseThrow(() -> new RuntimeException("Monitoria não encontrada"));

        // Encerra atuação anterior
        atuacaoRepository.findByMonitoriaIdAndAtivaTrue(monitoriaId)
            .ifPresent(atuacao -> {
                atuacao.setDataFim(LocalDate.now().minusDays(1));
                atuacao.setAtiva(false);
                atuacaoRepository.save(atuacao);
            });

        // MONITOR ANTIGO -> Volta a ser ALUNO
        Usuario usuarioAntigo = monitoria.getMonitor().getUsuario();
        usuarioAntigo.setRole("ALUNO");
        usuarioRepository.save(usuarioAntigo);

        // NOVO USUÁRIO
        Usuario usuarioNovo = usuarioRepository.findById(novoUsuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Monitor novoMonitor = monitorRepository.findByUsuarioId(usuarioNovo.getId()).orElse(null);

        // Validação de acúmulo
        if (novoMonitor != null) {
            boolean jaTemAtiva = monitoriaRepository.findByMonitorId(novoMonitor.getId())
                    .stream().anyMatch(Monitoria::isAtiva);
            if (jaTemAtiva) {
                throw new RuntimeException("O novo usuário selecionado já possui uma monitoria ativa.");
            }
        } else {
            novoMonitor = new Monitor();
            novoMonitor.setUsuario(usuarioNovo);
            novoMonitor.setDisciplina(monitoria.getDisciplina());
            novoMonitor.setAtivo(true);
            novoMonitor = monitorRepository.save(novoMonitor);
        }

        // CRIA NOVA ATUAÇÃO
        AtuacaoMonitoria novaAtuacao = new AtuacaoMonitoria();
        novaAtuacao.setMonitoria(monitoria);
        novaAtuacao.setMonitor(novoMonitor);
        novaAtuacao.setDataInicio(LocalDate.now());
        novaAtuacao.setAtiva(true);
        atuacaoRepository.save(novaAtuacao);

        usuarioNovo.setRole("MONITOR");
        usuarioRepository.save(usuarioNovo);

        monitoria.setMonitor(novoMonitor);
        return monitoriaRepository.save(monitoria);
    }
    
    public List<Monitoria> listarTodas() {
        return monitoriaRepository.buscarTodasComRelacionamentos();
    }
    
    public Monitoria salvar(Monitoria monitoria) {
        return monitoriaRepository.save(monitoria);
    }
}