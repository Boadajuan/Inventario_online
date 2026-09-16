# Sistema de Inventario Online

¡Bienvenido al **Sistema de Inventario**! 📦✨

Este proyecto es una aplicación web full-stack (Front-end y Back-end) diseñada para gestionar y controlar el inventario de productos de forma eficiente y sencilla. Fue desarrollado como parte de la formación en **Tecnología en Desarrollo de Software (SENA)**.

## 🚀 ¿Para qué fue creado?

El objetivo principal de este sistema es digitalizar y simplificar el control de existencias en un negocio o almacén. Permite llevar un registro exacto de qué productos entran, cuáles se actualizan, cuáles se agotan o se venden, y facilita la administración integral del catálogo de artículos, evitando errores manuales y mejorando la toma de decisiones.

## ✨ Funcionalidades Principales (CRUD)

El sistema soporta todas las operaciones básicas de gestión (CRUD):

1. **📝 Registrar Productos:** Permite añadir nuevos artículos al inventario ingresando su código, nombre, categoría, proveedor, precio y cantidad inicial.
2. **👀 Consultar Productos:** Visualización en tiempo real del listado de todos los productos registrados, así como acceso a estadísticas básicas (ej. Total de productos, Disponibles, Agotados).
3. **🔄 Actualizar Existencias y Datos:** Modificación de la información de los productos existentes o actualización de su cantidad en stock.
4. **🗑️ Eliminar Productos:** Permite dar de baja productos que ya no se manejan o que fueron registrados por error.
5. **🛍️ Vender Productos (Simulación):** Deduce las cantidades del inventario activo basándose en las salidas o ventas realizadas.

## 🛠️ Tecnologías y Herramientas Utilizadas

**Front-end:**
- **HTML5 & CSS3:** Estructura semántica y diseño visual personalizado.
- **JavaScript (Vanilla):** Lógica del lado del cliente e interacción dinámica con el DOM.
- **Bootstrap 5:** Framework CSS para un diseño responsivo (adaptable a dispositivos móviles) y moderno.
- **Font Awesome:** Íconos vectoriales escalables para mejorar la interfaz de usuario.

**Back-end:**
- **Java 17+ & Spring Boot:** Framework robusto para la creación de la API REST.
- **Spring Data JPA / Hibernate:** Mapeo objeto-relacional (ORM) para la comunicación con la base de datos.
- **Maven:** Gestor de dependencias y empaquetado del proyecto.

## 📂 Estructura del Proyecto

El repositorio contiene dos partes principales combinadas:
- `app.js`, `estilos.css`, `index.html`, `form.html`, `productos.html`: Archivos correspondientes a la interfaz gráfica (Front-end).
- Carpeta `sistema-inventario/`: Contiene todo el código fuente del servidor Back-end en Spring Boot, incluyendo Modelos (`Producto`), Controladores, Repositorios y Servicios.

## 👨‍💻 Autor

- **Juan José Boada Salazar**
- **Programa:** Tecnología en Desarrollo de Software - Ficha 3233929 (SENA)
- **Contacto / GitHub:** [@Boadajuan](https://github.com/Boadajuan)

---
*Este proyecto es de carácter académico y demuestra la integración de tecnologías Front-end y Back-end en una aplicación funcional.*
