package com.eva.monitorai.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.exception.MaterialNotFoundException;
import com.eva.monitorai.exception.UsuarioNotFoundException;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.UsuarioRepository;

@RestController
@RequestMapping("/materiais")
@CrossOrigin("*")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    // CURTIR / DESCURTIR
    @PostMapping("/{id}/curtir")
    public ResponseEntity<?> curtirMaterial(
            @PathVariable Long id,
            Authentication auth
    ) {

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
        		.orElseThrow(UsuarioNotFoundException::new);

        Material material = materialRepository.findById(id)
        		.orElseThrow(MaterialNotFoundException::new);

        // se já curtiu -> remove
        if(material.getCurtidas().contains(usuario)) {
            material.getCurtidas().remove(usuario);
        }

        // se não curtiu -> adiciona
        else {
            material.getCurtidas().add(usuario);
        }

        materialRepository.save(material);

        Map<String, Object> response = new HashMap<>();

        response.put("curtidas", material.getCurtidas().size());

        response.put(
            "curtido",
            material.getCurtidas().contains(usuario)
        );

        return ResponseEntity.ok(response);
    }


    // VER QTD DE CURTIDAS
    @GetMapping("/{id}/curtidas")
    public ResponseEntity<?> verCurtidas(@PathVariable Long id){

        Material material = materialRepository.findById(id)
        		.orElseThrow(MaterialNotFoundException::new);

        Map<String, Object> response = new HashMap<>();

        response.put("curtidas", material.getCurtidas().size());

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/status-curtida")
    public ResponseEntity<?> statusCurtida(
            @PathVariable Long id,
            Authentication auth
    ) {

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
        		.orElseThrow(UsuarioNotFoundException::new);

        Material material = materialRepository.findById(id)
        		.orElseThrow(MaterialNotFoundException::new);

        boolean curtiu = material.getCurtidas().contains(usuario);

        Map<String, Object> response = new HashMap<>();
        response.put("curtido", curtiu);

        return ResponseEntity.ok(response);
    }
}