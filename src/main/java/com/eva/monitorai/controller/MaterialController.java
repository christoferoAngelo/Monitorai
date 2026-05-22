package com.eva.monitorai.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.MaterialDTO;
import com.eva.monitorai.exception.MaterialNotFoundException;
import com.eva.monitorai.exception.UsuarioNotFoundException;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.TipoMaterial;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.UsuarioRepository;
import com.eva.monitorai.service.MaterialService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/materiais")
@CrossOrigin("*")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MaterialService materialService; // Injetado aqui!


    // =========================================
    // POSTAR NOVO MATERIAL (VÍDEO)
    // =========================================
    @PostMapping
    public ResponseEntity<Material> criarMaterial(
            @RequestBody MaterialDTO dto,
            Authentication auth
    ) {
        String username = auth.getName();
        Material novo = materialService.criarMaterialVideo(dto, username);
        return ResponseEntity.ok(novo);
    }

    // =========================================
    // LISTAR MATERIAIS DO MONITOR LOGADO
    // =========================================
    @GetMapping("/meus")
    public ResponseEntity<List<Material>> listarMeusMateriais(Authentication auth) {
        String username = auth.getName();
        List<Material> lista = materialService.listarMateriaisDoMonitor(username);
        return ResponseEntity.ok(lista);
    }

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
    
    @PostMapping("/{id}/salvar")
    public ResponseEntity<?> salvarMaterial(
            @PathVariable Long id,
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow();

        Material material = materialRepository.findById(id)
                .orElseThrow();

        usuario.getMateriaisSalvos().add(material);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Material salvo");
    }
    
    
    @DeleteMapping("/{id}/salvar")
    public ResponseEntity<?> removerSalvo(
            @PathVariable Long id,
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow();

        Material material = materialRepository.findById(id)
                .orElseThrow();

        usuario.getMateriaisSalvos().remove(material);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Material removido dos salvos");
    }
    
    @Transactional
    public Material criarMaterialPdf(MaterialDTO dto, String username) {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!"MONITOR".equals(usuario.getRole())) {
            throw new RuntimeException("Apenas monitores podem criar materiais");
        }

        Material material = new Material();
        material.setTitulo(dto.getTitulo());
        material.setConteudo(dto.getConteudo());
        material.setUrl(dto.getUrl());
        material.setTipo(TipoMaterial.DOCUMENTO);

        return materialRepository.save(material);
    }
    
    // =========================================
    // CRIAR QUIZZ (Corrigido para seguir a lógica do vídeo)
    // =========================================
    @PostMapping("/quizz")
    public ResponseEntity<Material> criarQuizz(
            @RequestBody MaterialDTO dto, 
            Authentication auth) {
        
        String username = auth.getName(); // Igualzinho ao fluxo do vídeo!
        Material novoQuizz = materialService.criarMaterialQuizz(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoQuizz);
    }
    
    
    @GetMapping
    public ResponseEntity<List<Material>> listarTodos() {
        return ResponseEntity.ok(materialRepository.findAll());
    }
}