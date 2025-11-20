const PDFDocument = require('pdfkit');

const generatePerfilPDF = (perfil) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fillColor('#0176de')
         .fontSize(24)
         .text('MetaRed Perfiles UC', { align: 'center' });

      doc.moveDown();
      doc.fillColor('#333')
         .fontSize(18)
         .text(perfil.nombre, { align: 'center' });

      doc.moveDown(0.5);
      doc.fillColor('#666')
         .fontSize(12)
         .text(`Código: ${perfil.codigo}`, { align: 'center' });

      doc.moveDown(1.5);

      // Info boxes
      const addSection = (title, content) => {
        if (!content) return;

        doc.fillColor('#0176de')
           .fontSize(14)
           .text(title);

        doc.moveDown(0.3);
        doc.fillColor('#333')
           .fontSize(11);

        // Check if content is a list (has line breaks)
        if (content.includes('\n')) {
          const items = content.split('\n').filter(item => item.trim());
          items.forEach(item => {
            doc.text(`• ${item.trim()}`, { indent: 10 });
          });
        } else {
          doc.text(content);
        }

        doc.moveDown(1);
      };

      // Metadata
      doc.fillColor('#666')
         .fontSize(10)
         .text(`Categoría: ${perfil.categoria}`)
         .text(`Área de Conocimiento: ${perfil.area_conocimiento}`)
         .text(`Tipo de Cargo: ${perfil.tipo_cargo}`);

      doc.moveDown(1.5);

      // Content sections
      addSection('Descripción del Cargo', perfil.descripcion);
      addSection('Responsabilidades', perfil.responsabilidades);
      addSection('Requisitos del Puesto', perfil.requisitos);

      // Footer
      const footerY = doc.page.height - 50;
      doc.fillColor('#999')
         .fontSize(8)
         .text(
           `Generado el ${new Date().toLocaleDateString('es-CL')} - Universidad Católica de Chile`,
           50,
           footerY,
           { align: 'center' }
         );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generatePerfilPDF
};
