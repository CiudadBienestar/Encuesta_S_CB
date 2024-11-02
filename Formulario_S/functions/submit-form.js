const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    // Parsear los datos del formulario
    const formData = JSON.parse(event.body);

    // Validación básica del lado del servidor
    if (!formData.fecha || !formData.curso || !formData.genero) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    // Hacer la petición a Airtable
    const response = await fetch('https://api.airtable.com/v0/app2YFzD9rCXBlB5P/Satisfaccion_Cursos_CB', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: formData })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error de Airtable: ${errorResponse.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error al procesar la solicitud' })
    };
  }
};
