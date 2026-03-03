const API_URL = "http://127.0.0.1:8000";

document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const carrera = document.getElementById("carrera").value;
    const nivel_academico = document.getElementById("nivel_academico").value;

    const data = {
        nombre: nombre,
        carrera: carrera,
        nivel_academico: nivel_academico
    };

    try {
        const response = await fetch(`${API_URL}/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("mensaje").innerText = "Usuario creado correctamente";
        console.log(result);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("mensaje").innerText = "Error al conectar con el servidor";
    }
});