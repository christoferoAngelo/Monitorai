package com.eva.monitorai.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.eva.monitorai.repository.UsuarioRepository;


/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE PRECISA EXISTIR PRA DAR OVERRIDE EM MÉTODOS 
 * 			PRÉ CONFIGURADOS DO SPRING SECURITY QUE NÓS NÃO UTILIZAMOS
 * 			NESSE PROJETO
 * 
 * 
 * ========================================================================================== */


@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return repository.findByUsername(username)
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
    
    
    
}