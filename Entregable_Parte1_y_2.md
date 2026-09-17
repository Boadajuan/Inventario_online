# ENTREGABLE PARTE 1: ANÁLISIS DEL PROYECTO

## Actividad 1: Explicación del Flujo de la Arquitectura

El flujo de esta arquitectura sigue un modelo de capas clásico en el desarrollo web moderno, asegurando que cada componente tenga una responsabilidad única y separada.

1. **Frontend**: Es la interfaz visual (archivos HTML y CSS) con la que interactúa el usuario. Aquí se capturan los datos (por ejemplo, mediante formularios).
2. **JavaScript**: Actúa como el intermediario entre el usuario y el servidor. Mediante funciones asíncronas (como `fetch`), captura las acciones del Frontend, convierte los datos a formato JSON y los envía a través de peticiones HTTP (GET, POST, PUT, DELETE) hacia el Backend.
3. **Spring Boot (Controller)**: Es la puerta de entrada del Backend. Recibe las peticiones HTTP enviadas por JavaScript, extrae los datos y decide qué hacer con ellos llamando a la capa de servicio correspondiente, sin procesar lógica compleja directamente.
4. **Service**: Es el "cerebro" o la capa de negocio. Aquí se procesan las reglas de la aplicación, las validaciones y cálculos antes de interactuar con la base de datos. Sirve para mantener el Controller limpio.
5. **Repository**: Es la capa de acceso a datos. Utiliza Spring Data JPA para traducir automáticamente operaciones de Java (como `save()` o `findAll()`) en comandos SQL, comunicándose directamente con la base de datos.
6. **MySQL**: Es el motor de base de datos relacional donde finalmente se almacenan y persisten los datos físicos en tablas y columnas de forma segura.

---

## Actividad 2: Función de cada archivo y Código

### 1. `Producto.java`
**Función:** Es la clase Entidad (Modelo). Representa la estructura de la tabla `producto` en la base de datos MySQL. Define los atributos del producto (id, nombre, precio, etc.) y utiliza anotaciones JPA (`@Entity`, `@Table`) para mapear la clase a la base de datos.

**Código (incluyendo las modificaciones de la Actividad 3):**
```java
package com.sena.sistema_inventario.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;
    private String nombre;
    private String marca; // Actividad 3: Nueva propiedad
    private String categoria;
    private String proveedor;
    private Double precio;
    private Integer cantidad;

    public Producto() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
```

### 2. `ProductoRepository.java`
**Función:** Interfaz que extiende de `JpaRepository`. Se encarga de gestionar la conexión y transacciones con la base de datos para la entidad Producto, permitiendo realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sin necesidad de escribir código SQL manual.

**Código (incluyendo las modificaciones de la Actividad 8):**
```java
package com.sena.sistema_inventario.repository;

import com.sena.sistema_inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Actividad 8: Método para buscar por nombre (ignora mayúsculas/minúsculas)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
```

### 3. `ProductoService.java`
**Función:** Capa de lógica de negocio. Recibe llamadas del Controller, inyecta el `ProductoRepository` y ejecuta las operaciones necesarias. Aquí se implementa la lógica de cómo actualizar o buscar un producto, manteniendo el código ordenado.

**Código:**
```java
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

    // Actividad 8: Implementación de la búsqueda
    public List<Producto> buscarPorNombre(String nombre) {
        return repository.findByNombreContainingIgnoreCase(nombre);
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
            producto.setMarca(productoActualizado.getMarca()); // Actividad 3
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setProveedor(productoActualizado.getProveedor());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setCantidad(productoActualizado.getCantidad());
            return repository.save(producto);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado con id " + id));
    }
}
```

### 4. `ProductoController.java`
**Función:** Controla las rutas (endpoints) REST de la aplicación. Anotada con `@RestController`, expone las URLs (por ejemplo `/productos`) para que el frontend (JavaScript) pueda interactuar con el backend utilizando los métodos HTTP (GET, POST, PUT, DELETE).

**Código:**
```java
package com.sena.sistema_inventario.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;
import com.sena.sistema_inventario.model.Producto;
import com.sena.sistema_inventario.service.ProductoService;

@CrossOrigin("*") 
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

    // Actividad 8: Endpoint de búsqueda
    @GetMapping("/productos/buscar/{nombre}")
    public List<Producto> buscarProductoPorNombre(@PathVariable String nombre) {
        return service.buscarPorNombre(nombre);
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
}
```

### 5. `app.js`
**Función:** Es el archivo central de la lógica del frontend. Su propósito es capturar los eventos del usuario (como clics en botones o envío de formularios), consumir las APIs construidas en el `ProductoController` a través de peticiones `fetch`, y actualizar dinámicamente el HTML en el navegador sin recargar la página.
