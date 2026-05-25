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
    
    @Transactional
    public Material criarMaterialPdf(MaterialDTO dto, String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));

        Material material = new Material();
        material.setTitulo(dto.getTitulo());
        material.setConteudo(dto.getConteudo());
        material.setUrl(dto.getUrl());
        material.setTipo(TipoMaterial.DOCUMENTO); // Assumindo que DOCUMENTO = PDF no seu Enum
        material.setAutor(monitor);
        material.setDisciplina(monitor.getDisciplina()); 

        return materialRepository.save(material);
    }

    @Transactional
    public Material criarMaterialQuizz(MaterialDTO dto, String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(UsuarioNotFoundException::new);

        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Este usuário não possui um perfil de monitor ativo."));

        Material material = new Material();
        material.setTitulo(dto.getTitulo());
        material.setConteudo(dto.getConteudo());
        material.setUrl(dto.getUrl());
        material.setTipo(TipoMaterial.QUIZZ); // Corrigido para dois Z conforme seu Enum!
        material.setAutor(monitor);
        material.setDisciplina(monitor.getDisciplina());

        return materialRepository.save(material);
    }
    
    @Transactional
    public void deletarMaterial(Long materialId, String username) {
        // 1. Acha o usuário e o monitor
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(UsuarioNotFoundException::new);
        
        Monitor monitor = monitorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Monitor não encontrado"));

        // 2. Busca o material
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        // 3. SEGURANÇA: Verifica se quem está tentando deletar é o dono do material
        if (!material.getAutor().getId().equals(monitor.getId())) {
            throw new RuntimeException("Você não tem permissão para deletar materiais de outros monitores.");
        }

        // 4. Deleta
        materialRepository.delete(material);
    }
}