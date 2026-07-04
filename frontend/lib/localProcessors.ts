// @ts-ignore
const PDFDocument = (typeof window !== 'undefined' && window.PDFLib) ? window.PDFLib.PDFDocument : null;

export async function processLocally(toolSlug: string, fileOrFiles: File | File[], inputs: Record<string, string | number>): Promise<void> {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const file = files[0];

  // Handle PDF Tools
  if (toolSlug === "pdf-merge" || toolSlug === "pdf-split") {
    let resultPdfBytes;
    let newFilename = "";
    
    if (toolSlug === "pdf-merge") {
      const mergedPdf = await PDFDocument.create();
      for (const f of files) {
        const pdfBytes = await f.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page: any) => mergedPdf.addPage(page));
      }
      resultPdfBytes = await mergedPdf.save();
      newFilename = "merged_document.pdf";
    } else if (toolSlug === "pdf-split") {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      // just extract first page as an example of local processing
      const [firstPage] = await newPdf.copyPages(pdfDoc, [0]);
      newPdf.addPage(firstPage);
      resultPdfBytes = await newPdf.save();
      newFilename = file.name.replace(".pdf", "_split.pdf");
    }

    if (resultPdfBytes) {
      const blob = new Blob([resultPdfBytes], { type: 'application/pdf' });
      triggerDownload(blob, newFilename);
    }
    return;
  }

  // Handle Image Tools
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      let outputMimeType = file.type;
      let quality = 0.92;

      if (toolSlug === "image-resize") {
        if (inputs.width) width = parseInt(inputs.width.toString());
        if (inputs.height) height = parseInt(inputs.height.toString());
      } else if (toolSlug === "image-compress") {
        if (inputs.quality) quality = parseInt(inputs.quality.toString()) / 100;
        if (outputMimeType !== "image/jpeg" && outputMimeType !== "image/webp") {
          outputMimeType = "image/jpeg";
        }
      } else if (toolSlug.includes("-to-")) {
        const targetFormat = toolSlug.split("-to-")[1];
        if (targetFormat === "jpg") outputMimeType = "image/jpeg";
        else if (targetFormat === "png") outputMimeType = "image/png";
        else if (targetFormat === "webp") outputMimeType = "image/webp";
        else if (targetFormat === "bmp") outputMimeType = "image/bmp";
        else {
          outputMimeType = "image/png"; 
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      if (outputMimeType === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas to Blob failed"));
          return;
        }

        const originalNameParts = file.name.split(".");
        originalNameParts.pop();
        const baseName = originalNameParts.join(".");
        
        let ext = outputMimeType.split("/")[1];
        if (ext === "jpeg") ext = "jpg";
        
        triggerDownload(blob, `${baseName}_processed.${ext}`);
        resolve();
      }, outputMimeType, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
