import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// OCR a PDF file client-side using pdf.js + Tesseract.js
// Returns extracted text or an empty string if nothing found.
export async function ocrPdf(file, { onProgress } = {}) {
  // Configure pdf.js worker for bundlers like Vite
  try {
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
  } catch {
    // Ignore worker path errors; pdf.js may still function with default worker
    void 0;
  }

  const buffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const worker = await createWorker({
    logger: (m) => {
      if (onProgress) onProgress(m);
    },
  });

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const { data: { text } } = await worker.recognize(canvas);
    if (text) fullText += text + '\n\n';

    if (onProgress) onProgress({ status: 'page_done', pageNum, total: pdf.numPages });
  }

  await worker.terminate();

  return fullText.trim();
}