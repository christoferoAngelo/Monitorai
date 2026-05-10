package com.eva.monitorai.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.ComentarioDTO;
import com.eva.monitorai.model.entity.Comentario;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.ComentarioRepository;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.UsuarioRepository;

@RestController
@RequestMapping("/comentarios")
@CrossOrigin("*")
public class ComentarioController {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MaterialRepository materialRepository;


    // CRIAR COMENTÁRIO
    @PostMapping
    public ResponseEntity<?> criarComentario(
            @RequestBody ComentarioDTO dto,
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow();

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow();

        Comentario comentario = new Comentario();

        comentario.setTexto(dto.getTexto());
        comentario.setUsuario(usuario);
        comentario.setMaterial(material);
        comentario.setDataCriacao(LocalDateTime.now());

        comentarioRepository.save(comentario);

        return ResponseEntity.ok(comentario);
    }


    // LISTAR COMENTÁRIOS DO MATERIAL
    @GetMapping("/material/{id}")
    public ResponseEntity<List<Comentario>> listarComentarios(
            @PathVariable Long id
    ){

        List<Comentario> comentarios =
                comentarioRepository.findByMaterialId(id);

        return ResponseEntity.ok(comentarios);
    }


    // EXCLUIR COMENTÁRIO
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirComentario(
            @PathVariable Long id,
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow();

        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow();

        boolean ehDono =
                comentario.getUsuario().getId().equals(usuario.getId());

        boolean ehAdmin =
                usuario.getRole().equals("ADMIN");

        if(!ehDono && !ehAdmin){
            return ResponseEntity.status(403)
                    .body("Você não pode excluir este comentário");
        }

        comentarioRepository.delete(comentario);

        return ResponseEntity.ok("Comentário removido");
    }
}