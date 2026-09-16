package com.sena.sistema_inventario;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.sena.sistema_inventario.repository.ProductoRepository;

@SpringBootApplication
public class SistemaInventarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaInventarioApplication.class, args);
	}

	@Bean
	CommandLineRunner probarRepositorio(ProductoRepository repository) {
		return args -> {
			System.out.println("PRODUCTOS REGISTRADOS:");
			repository.findAll().forEach(producto -> {
				System.out.println(producto.getNombre());
			});
		};
	}
}
