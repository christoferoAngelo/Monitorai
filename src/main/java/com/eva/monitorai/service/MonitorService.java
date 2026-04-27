package com.eva.monitorai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eva.monitorai.model.entity.Monitor;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.MonitorRepository;
import com.eva.monitorai.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class MonitorService {

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Monitor cadastrarMonitor(Long usuarioId, Long disciplinaId, String horarios, String local) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza a role do usuário para MONITOR, caso ainda não seja
        usuario.setRole("MONITOR");
        usuarioRepository.save(usuario);

        // Aqui você buscaria a disciplina do banco (precisaria do DisciplinaRepository)
        // Por enquanto, vamos supor que você já tenha o objeto disciplina
        Monitor monitor = new Monitor();
        monitor.setUsuario(usuario);
        // monitor.setDisciplina(disciplina); // Setar a disciplina buscada
        monitor.setHorariosDisponiveis(horarios);
        monitor.setLocal(local);

        return monitorRepository.save(monitor);
    }
}
