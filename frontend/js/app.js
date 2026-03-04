// app.js
const API_URL = "http://127.0.0.1:8000";

// Espera a que se envíe el formulario
document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Crear objeto con todos los campos
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role: document.getElementById("role").value,
        carrera: document.getElementById("carrera").value.trim(),
        nivel_academico: document.getElementById("nivel_academico").value.trim()
    };

    // Debug: ver qué se está enviando
    console.log("Datos a enviar:", data);

    // Validación rápida: revisar si algún campo está vacío
    for (const key in data) {
        if (!data[key]) {
            document.getElementById("mensaje").innerText = `Por favor completa el campo "${key}"`;
            return; // Detener envío si falta algún campo
        }
    }

    try {
        const response = await fetch(`${API_URL}/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del backend:", errorData);
            document.getElementById("mensaje").innerText = "Error al registrar usuario. Revisa los datos.";
            return;
        }

        const result = await response.json();
        console.log("Respuesta del backend:", result);
        document.getElementById("mensaje").innerText = "Usuario creado correctamente";

        // Opcional: limpiar formulario
        document.getElementById("userForm").reset();

    } catch (error) {
        console.error("Error de conexión:", error);
        document.getElementById("mensaje").innerText = "Error al conectar con el servidor";
    }
});