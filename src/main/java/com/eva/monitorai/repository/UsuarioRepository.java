package com.eva.monitorai.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.eva.monitorai.model.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);
    
    Boolean existsByUsername(String username);
}

