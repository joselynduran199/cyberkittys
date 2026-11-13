document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL MODO CLARO / OSCURO
    // ==========================================
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;

    // Revisar si la usuaria ya guardó una preferencia anteriormente
    const temaGuardado = localStorage.getItem('tema');

    // Revisar cuál es el tema del sistema operativo actual
    const temaSistemaEsOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aplicar el tema inicial correcto al cargar la página
    if (temaGuardado === 'oscuro' || (!temaGuardado && temaSistemaEsOscuro)) {
        body.classList.add('dark-theme');
        if(btnTema) btnTema.textContent = '☀️'; 
    }

    // Escuchar el clic en el botón para cambiar el tema
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('tema', 'oscuro');
                btnTema.textContent = '☀️';
            } else { 
                localStorage.setItem('tema', 'claro');
                btnTema.textContent = '🌙';
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DEL FORMULARIO DE REGISTRO
    // ==========================================
    const registroForm = document.getElementById('registroForm');
    
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const statusMsg = document.getElementById('form-status');
            statusMsg.innerText = "Enviando solicitud...";

            const datos = {
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                motivo: document.getElementById('motivo').value
            };

            try {
                // Aquí conectarás con tu API en FastAPI
                const response = await fetch('https://api.tudominio.mx/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                if (response.ok) {
                    statusMsg.innerText = "¡Solicitud enviada! Nos pondremos en contacto contigo pronto.";
                    registroForm.reset();
                } else {
                    statusMsg.innerText = "Hubo un error al enviar la solicitud.";
                }
            } catch (error) {
                console.error("Error:", error);
                statusMsg.innerText = "Error de conexión con el servidor.";
            }
        });
    }
});