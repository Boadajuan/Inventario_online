const API_URL = "https://inventarioonline-production.up.railway.app/productos";
const AUTH_URL = "https://inventarioonline-production.up.railway.app/api/auth";

// Protección de rutas
const paginaActual = window.location.pathname.split("/").pop();
const usuarioActual = localStorage.getItem("usuario");

// Permitir acceso si es la página de login o registro (con o sin extensión .html)
const rutasPublicas = ["index.html", "registro.html", "index", "registro", ""];
if (!usuarioActual && !rutasPublicas.includes(paginaActual)) {
    window.location.href = "index.html";
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

let productos = []; // Ahora se llenará desde la base de datos
let idEditando = null;
// Función para consultar productos a la BD (READ)
async function mostrarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        productos = await respuesta.json(); // Datos que provienen de MySQL

        const tabla = document.getElementById("tablaProductos");
        if (!tabla) return;
        tabla.innerHTML = "";
        
        let totalInventario = 0;

        productos.forEach(function(producto) {
            const valorTotal = producto.precio * producto.cantidad;
            totalInventario += valorTotal;
            
            const estado = producto.cantidad > 0 ? "Disponible" : "Agotado";
            const stockBajo = producto.cantidad < 10 ? "<br><span class='text-danger'>⚠ Stock bajo</span>" : "";

            const fila = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.marca || ''}</td>
                <td>${producto.categoria}</td>
                <td>${producto.proveedor || ''}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad} ${stockBajo}</td>
                <td>${estado}</td>
                <td>$${valorTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
            `;
            tabla.innerHTML += fila;
        });

        const totalGeneral = document.getElementById("totalGeneral");
        if (totalGeneral) {
            totalGeneral.textContent = "$" + totalInventario.toFixed(2);
        }

    } catch (error) {
        console.error("No se pudo conectar al backend:", error);
    }
}

// Actividad 8 y 9: Función para buscar productos
async function buscarProductos() {
    const nombre = document.getElementById("inputBusqueda").value.trim();
    if (!nombre) {
        await mostrarProductos();
        return;
    }
    
    try {
        const respuesta = await fetch(`${API_URL}/buscar/${nombre}`);
        productos = await respuesta.json(); // Actualizar la variable local con los resultados
        
        const tabla = document.getElementById("tablaProductos");
        if (!tabla) return;
        tabla.innerHTML = "";
        
        let totalInventario = 0;

        productos.forEach(function(producto) {
            const valorTotal = producto.precio * producto.cantidad;
            totalInventario += valorTotal;
            
            const estado = producto.cantidad > 0 ? "Disponible" : "Agotado";
            const stockBajo = producto.cantidad < 10 ? "<br><span class='text-danger'>⚠ Stock bajo</span>" : "";

            const fila = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.marca || ''}</td>
                <td>${producto.categoria}</td>
                <td>${producto.proveedor || ''}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad} ${stockBajo}</td>
                <td>${estado}</td>
                <td>$${valorTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
            `;
            tabla.innerHTML += fila;
        });

        const totalGeneral = document.getElementById("totalGeneral");
        if (totalGeneral) {
            totalGeneral.textContent = "$" + totalInventario.toFixed(2);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
}

// Capturar formulario y enviar al servidor (CREATE / UPDATE)
const formulario = document.getElementById("formProducto");
if (formulario) {
    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();

        const producto = {
            codigo: document.getElementById("codigo").value,
            nombre: document.getElementById("nombre").value,
            marca: document.getElementById("marca").value,
            categoria: document.getElementById("categoria").value,
            proveedor: document.getElementById("proveedor").value,
            precio: Number(document.getElementById("precio").value),
            cantidad: Number(document.getElementById("cantidad").value)
        };

        // Opción D: Validaciones de campos
        if (!producto.codigo || !producto.nombre || !producto.marca || !producto.categoria || !producto.proveedor) {
            alert("No se permiten campos vacíos.");
            return;
        }
        if (producto.precio <= 0) {
            alert("El precio debe ser un número positivo mayor a 0.");
            return;
        }
        if (producto.cantidad < 0) {
            alert("La cantidad no puede ser negativa.");
            return;
        }

        if (idEditando === null) {
            // Enviar a la Base de Datos con POST
            try {
                const respuesta = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
                if (respuesta.ok) {
                    alert("Producto registrado correctamente");
                } else {
                    alert("No fue posible registrar el producto");
                }
            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Error al conectar con el servidor");
            }
        } else {
            // Enviar a la Base de Datos con PUT
            try {
                const respuesta = await fetch(`${API_URL}/${idEditando}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
                if (respuesta.ok) {
                    alert("Producto actualizado correctamente");
                } else {
                    alert("No fue posible actualizar el producto");
                }
            } catch (error) {
                console.error("Error al actualizar:", error);
                alert("Error al conectar con el servidor");
            }
            idEditando = null;
            document.querySelector("#formProducto button[type='submit']").textContent = "Guardar Producto";
        }

        await mostrarProductos(); // Recargar de la base de datos
        formulario.reset();
    });
}

// Función para eliminar (DELETE)
async function eliminarProducto(id) {
    const confirmar = confirm("¿Está seguro de eliminar este producto?");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (respuesta.ok) {
            alert("Producto eliminado correctamente");
            await mostrarProductos();
        } else {
            alert("No fue posible eliminar el producto");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("Error al conectar con el servidor");
    }
}

// Función para editar (Poblar formulario)
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    // Si no estamos en la página que tiene el formulario, mostrar un mensaje.
    const formElement = document.getElementById("formProducto");
    if (!formElement) {
        alert("Para editar un producto, por favor vaya a la página de 'Registrar Producto'.");
        return;
    }

    idEditando = id;

    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("marca").value = producto.marca || '';
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("proveedor").value = producto.proveedor || '';
    document.getElementById("precio").value = producto.precio;
    document.getElementById("cantidad").value = producto.cantidad;

    document.querySelector("#formProducto button[type='submit']").textContent = "Actualizar Producto";
}

// Cargar la tabla al iniciar
mostrarProductos();