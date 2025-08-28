import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Puedes poner tu dominio en vez de '*'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const {
      nombre,
      email,
      telefono,
      empresa,
      motivo,
      intereses,
      descripcion
    } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'presupuesto@jaweb.es',
      to: 'yolanda@jmfortiz.com',
      subject: 'Nuevo contacto desde el formulario',
      html: `
        <h2>Detalles del contacto JMF Ortiz</h2>
        <p><strong>Nombre:</strong> ${nombre || 'No especificado'}</p>
        <p><strong>Email:</strong> ${email || 'No especificado'}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No especificado'}</p>
        <p><strong>Empresa:</strong> ${empresa || 'No especificado'}</p>
        <p><strong>Motivo de contacto:</strong> ${motivo || 'No especificado'}</p>
        <p><strong>Intereses:</strong> ${intereses || 'Ninguno'}</p>
        <hr />
        <p><strong>Mensaje:</strong></p>
        <p>${descripcion || 'Sin mensaje'}</p>
      `,
    });

    if (error) {
      return res.status(500).json({ error: error.message || 'Error enviando email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
}
