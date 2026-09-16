package com.sena.sistema_inventario.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sena.sistema_inventario.model.Producto;
import com.sena.sistema_inventario.service.ProductoService;

@CrossOrigin("*") // Permite que el frontend se conecte sin bloqueos de seguridad CORS
@RestController
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping("/productos")
    public List<Producto> listarProductos() {
        return service.listarProductos();
    }

    @PostMapping("/productos")
    public Producto guardarProducto(@RequestBody Producto producto) {
        return service.guardarProducto(producto);
    }

    @GetMapping("/productos/{id}")
    public Optional<Producto> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/productos/{id}")
    public Producto modificarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return service.actualizarProducto(id, producto);
    }

    @DeleteMapping("/productos/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        service.eliminarProducto(id);
    }

    @GetMapping("/categorias")
    public String listarCategorias() {
        return "Lista de categorias";
    }

    @GetMapping("/proveedores")
    public String listarProveedores() {
        return "Lista de proveedores";
    }
}
