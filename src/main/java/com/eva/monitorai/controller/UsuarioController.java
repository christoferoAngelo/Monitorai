package com.eva.monitorai.controller;

import com.eva.monitorai.dto.PerfilDTO;
import com.eva.monitorai.dto.UsuarioDTO;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // Endpoint para listar todos os usuários pro Frontend
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        List<Usuario> usuarios = repository.findAll();
        
        // Converte a lista de Entity para lista de DTO
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(usuariosDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> promover(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Define a nova role (garantindo o prefixo ROLE_ se necessário)
        String novaRole = dto.getRole();
        usuario.setRole(novaRole);
        
        repository.save(usuario);
        return ResponseEntity.ok(converterParaDTO(usuario));
    }

    // ==========================================
    // MÉTODOS DE CONVERSÃO (MAPPER)
    // ==========================================

    /**
     * Transforma uma Entidade (Banco) em DTO (Frontend).
     * Oculta a senha e os materiais curtidos.
     */
    private UsuarioDTO converterParaDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        dto.setRa(usuario.getRa());
        return dto;
    }

    /**
     * Transforma um DTO (Frontend) de volta em Entidade (Banco).
     * Útil caso você vá fazer um endpoint de atualização (PUT) depois.
     */
    private Usuario converterParaEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(dto.getRole());
        usuario.setRa(dto.getRa());
        
        return usuario;
    }
    
    @GetMapping("/buscar")
    public List<UsuarioDTO> buscarUsuarios(@RequestParam String termo) {

        List<Usuario> usuarios = repository.findAll();

        return usuarios.stream()
                .filter(u ->

                        (u.getUsername() != null &&
                         u.getUsername().toLowerCase().contains(termo.toLowerCase()))

                        ||

                        (u.getEmail() != null &&
                         u.getEmail().toLowerCase().contains(termo.toLowerCase()))

                        ||

                        (u.getRa() != null &&
                         u.getRa().contains(termo))
                )
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/me/salvos")
    public ResponseEntity<?> listarSalvos(
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = repository.findByUsername(username)
                .orElseThrow();

        return ResponseEntity.ok(usuario.getMateriaisSalvos());
    }
    
    @GetMapping("/me/perfil")
    public ResponseEntity<?> meuPerfil(
            Authentication auth
    ){

        String username = auth.getName();

        Usuario usuario = repository.findByUsername(username)
                .orElseThrow();

        PerfilDTO perfil = new PerfilDTO(
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getRa(),
                usuario.getMateriaisSalvos()
        );

        return ResponseEntity.ok(perfil);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        
        List<Usuario> usuarios = repository.findAll();
        
        stats.put("totalAlunos", usuarios.stream()
            .filter(u -> "ALUNO".equals(u.getRole()))
            .count());
            
        stats.put("totalMonitores", usuarios.stream()
            .filter(u -> "MONITOR".equals(u.getRole()))
            .count());
            
        stats.put("totalAdmins", usuarios.stream()
            .filter(u -> "ADMIN".equals(u.getRole()))
            .count());
            
        stats.put("totalMateriais", 3563L);
        stats.put("totalRelatorios", 892L);
        
        return ResponseEntity.ok(stats);
    }
    

}
