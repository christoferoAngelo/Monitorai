package com.eva.monitorai.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eva.monitorai.model.entity.Comentario;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.ComentarioRepository;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.UsuarioRepository;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MaterialRepository materialRepository;

    public Comentario criarComentario(
            String texto,
            Long materialId,
            String username
    ) {

        Usuario usuario = usuarioRepository
                .findByUsername(username)
                .orElseThrow();

        Material material = materialRepository
                .findById(materialId)
                .orElseThrow();

        Comentario comentario = new Comentario();

        comentario.setTexto(texto);
        comentario.setUsuario(usuario);
        comentario.setMaterial(material);
        comentario.setDataCriacao(LocalDateTime.now());

        return comentarioRepository.save(comentario);
    }

    public List<Comentario> listarPorMaterial(
            Long materialId
    ) {
        return comentarioRepository
                .findByMaterialId(materialId);
    }

    public void deletarComentario(
            Long comentarioId,
            String username
    ) {

        Usuario usuario = usuarioRepository
                .findByUsername(username)
                .orElseThrow();

        Comentario comentario = comentarioRepository
                .findById(comentarioId)
                .orElseThrow();

        if(
            !comentario.getUsuario()
                .getId()
                .equals(usuario.getId())
        ){
            throw new RuntimeException(
                "Sem permissão"
            );
        }

        comentarioRepository.delete(comentario);
    }
}