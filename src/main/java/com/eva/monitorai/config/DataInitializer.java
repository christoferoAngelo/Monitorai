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
            admin.setAtivo(true); 
            
            Usuario aluno1 = new Usuario();
            aluno1.setUsername("fulano");
            aluno1.setEmail("fulano@gmail.com");
            // Criptografa a senha antes de salvar
            aluno1.setSenha(passwordEncoder.encode("123"));
            aluno1.setRole("ALUNO"); 
            aluno1.setRa("123456789010");
            aluno1.setAtivo(true);

            Usuario aluno2 = new Usuario();
            aluno2.setUsername("ciclano");
            aluno2.setEmail("ciclano@gmail.com");
            // Criptografa a senha antes de salvar
            aluno2.setSenha(passwordEncoder.encode("123"));
            aluno2.setRole("ALUNO"); 
            aluno2.setRa("123456789011");
            aluno2.setAtivo(true);
            
            Usuario monitor = new Usuario();
            monitor.setUsername("monitorildo");
            monitor.setEmail("monitorildo@gmail.com");
            // Criptografa a senha antes de salvar
            monitor.setSenha(passwordEncoder.encode("123"));
            monitor.setRole("MONITOR"); 
            monitor.setRa("123456789012");
            monitor.setAtivo(true);
            
            usuarioRepository.save(aluno1);
            usuarioRepository.save(aluno2);
            usuarioRepository.save(monitor);
            usuarioRepository.save(admin);
            
            System.out.println("Usuário ADMIN criado com sucesso! Login: admin / Senha: admin123"
            				+ " Usuário monitorildo criado com sucesso! Login: monitorildo / Senha: 123"
            				+ " Usuário ciclano criado com sucesso! Login: ciclano / Senha: 123"
            				+ " Usuário fulano criado com sucesso! Login: fulano / Senha: 123");
            					
        } else {
            System.out.println("Banco de dados já possui usuários. Pulando inicialização.");
        }
    }
}
