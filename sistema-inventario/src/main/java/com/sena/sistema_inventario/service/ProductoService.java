package com.sena.sistema_inventario.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sena.sistema_inventario.model.Producto;
import com.sena.sistema_inventario.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listarProductos() {
        return repository.findAll();
    }

    public Producto guardarProducto(Producto producto) {
        return repository.save(producto);
    }

    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void eliminarProducto(Long id) {
        repository.deleteById(id);
    }

    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        return repository.findById(id).map(producto -> {
            producto.setCodigo(productoActualizado.getCodigo());
            producto.setNombre(productoActualizado.getNombre());
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setProveedor(productoActualizado.getProveedor());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setCantidad(productoActualizado.getCantidad());
            return repository.save(producto);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado con id " + id));
    }
}
