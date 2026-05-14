package com.eva.monitorai.service;

import com.eva.monitorai.dto.MaterialDTO;
import com.eva.monitorai.exception.UsuarioNotFoundException;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Monitor;
import com.eva.monitorai.model.entity.TipoMaterial;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.MonitorRepository;
import com.eva.monitorai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Material criarMaterialVideo(MaterialDTO dto, String username) {
        // 1. Acha o usuário pelo username vindo do Security
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(UsuarioNotFoundException::new);

        // 2. Acha o perfil de monitor dele
        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Este usuário não possui um perfil de monitor ativo."));

        // 3. Monta o material
        Material material = new Material();
        material.setTitulo(dto.getTitulo());
        material.setConteudo(dto.getConteudo());
        material.setUrl(dto.getUrl());
        material.setTipo(TipoMaterial.VIDEO);
        material.setAutor(monitor);
        material.setDisciplina(monitor.getDisciplina()); // Vincula automaticamente à matéria dele!

        return materialRepository.save(material);
    }

    public List<Material> listarMateriaisDoMonitor(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(UsuarioNotFoundException::new);

        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Perfil de monitor não encontrado."));
                
        return materialRepository.findByAutorId(monitor.getId());
    }
}