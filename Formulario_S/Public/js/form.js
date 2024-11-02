document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('evaluationForm');
    const submitButton = form.querySelector('button[type="submit"]');

    // Establecer la fecha actual
    document.getElementById('fecha').valueAsDate = new Date();

    // Manejar el campo "otro" género
    const otroRadio = document.querySelector('input[name="genero"][value="otro"]');
    const otroInput = document.getElementById('otroInput');
    
    if (otroRadio) {
        otroRadio.addEventListener('change', function() {
            otroInput.style.display = this.checked ? 'inline' : 'none';
            if (this.checked) {
                otroInput.setAttribute('required', 'required');
            } else {
                otroInput.removeAttribute('required');
            }
        });
    }

    // Función para mostrar mensajes de estado
    const showMessage = (message, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message ${type}-message`;
        messageDiv.setAttribute('role', 'alert');
        messageDiv.setAttribute('aria-live', 'polite'); // Mejora accesibilidad
        messageDiv.textContent = message;
        
        form.insertBefore(messageDiv, form.firstChild);
        setTimeout(() => messageDiv.remove(), 5000);
    };

    // Manejar el envío del formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Deshabilitar el formulario durante el envío
        submitButton.disabled = true;
        form.classList.add('loading');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';

        try {
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);

            // Enviar datos a nuestra función serverless
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Error al enviar el formulario');
            }

            showMessage('¡Formulario enviado con éxito!', 'success');
            form.reset();
            document.getElementById('fecha').valueAsDate = new Date();

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'Error al enviar el formulario', 'error');
        } finally {
            submitButton.disabled = false;
            form.classList.remove('loading');
            submitButton.textContent = originalButtonText;
        }
    });
});
