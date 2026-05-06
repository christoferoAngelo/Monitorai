package com.eva.monitorai.config;


import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;



/*=============================================================================================
 * 
 * 
 * 			ESSA CLASSE CRIA UM USUÁRIO ADMIN QUANDO O BANCO É INICIALIZADO
 * 			USUARIO: admin
 * 			EMAIL  : admin@vitrine.com
 * 			SENHA  : admin123
 * 
 * 
 * ========================================================================================== */





@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // Verifica se já existe algum usuário no banco
        if (usuarioRepository.count() == 0) {
            System.out.println("Semeando banco de dados: Criando usuário ADMIN padrão...");

            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setEmail("admin@vitrine.com");
            // Criptografa a senha antes de salvar
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN"); 

            usuarioRepository.save(admin);
            
            System.out.println("Usuário ADMIN criado com sucesso! Login: admin / Senha: admin123");
        } else {
            System.out.println("Banco de dados já possui usuários. Pulando inicialização.");
        }
    }
}
