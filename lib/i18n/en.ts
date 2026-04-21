export const en = {
  site: { name: 'QuickTools' },
  nav: { back: '← QuickTools' },
  footer: { copyright: '© 2025 QuickTools' },

  home: {
    badge: 'QuickTools',
    h1line1: 'Free online tools.',
    h1line2: 'Fast, private, free.',
    subheading: 'No uploads. No accounts. Everything runs directly in your browser.',
    openTool: 'Open tool →',
    why: {
      heading: 'Why QuickTools?',
      features: [
        {
          title: 'Client-side processing',
          body: 'Every computation runs in your browser. Files are never transmitted to a server.',
        },
        {
          title: 'No account required',
          body: 'Open any tool and use it. No sign-up, no email, no friction.',
        },
        {
          title: 'Open source',
          body: 'The full source is on GitHub. Audit it, fork it, or contribute.',
        },
      ],
    },
  },

  privacyBadge: 'Your files never leave your browser',

  tools: {
    imageCompressor: {
      name: 'Image Compressor',
      cardDescription:
        'Reduce JPG, PNG, and WebP file sizes with a quality slider. See before/after sizes instantly.',
      h1: 'Image Compressor',
      dropzone: 'Drop an image here, or click to upload',
      dropzoneFormats: 'JPG, PNG, WebP',
      qualityLabel: 'Quality:',
      compressing: 'Compressing…',
      errorFailed: 'Compression failed. The file may be corrupted or unsupported.',
      labelOriginal: 'Original',
      labelSaved: 'Saved',
      labelOutput: 'Output',
      downloadBtn: 'Download compressed image',
      seoBody:
        'This image compressor runs entirely in your browser using the browser-image-compression library. It supports JPEG, PNG, and WebP formats and preserves the original resolution while reducing file size through quality adjustment. A quality setting of 80% typically delivers a 40–60% reduction in file size with no visible degradation. The compressed file is generated locally — nothing is uploaded or stored remotely. This makes it ideal for preparing images for email, web publishing, or any situation where smaller file sizes matter without sacrificing visual quality.',
    },

    qrCode: {
      name: 'QR Code Generator',
      cardDescription:
        'Turn any URL or text into a scannable QR code. Customize style and colors, download as PNG.',
      h1: 'QR Code Generator',
      inputLabel: 'URL or text',
      inputPlaceholder: 'https://example.com',
      sizeLabel: 'Size:',
      foregroundLabel: 'Foreground',
      backgroundLabel: 'Background',
      dotStyleLabel: 'Dot style',
      cornerStyleLabel: 'Corner style',
      errorLevelLabel: 'Error correction',
      downloadPng: 'Download PNG',
      downloadSvg: 'Download SVG',
      freeTag: 'Free',
      premiumTag: 'Premium',
      watchToUnlock: 'Watch 30s to unlock',
      styleSquare: 'Square',
      styleRounded: 'Rounded',
      styleDots: 'Dots',
      styleClassy: 'Classy',
      styleClassyRounded: 'Classy Rounded',
      styleExtraRounded: 'Extra Rounded',
      cornerSquare: 'Square',
      cornerExtraRounded: 'Rounded',
      cornerDot: 'Dot',
      seoBody:
        'This QR code generator creates scannable codes directly in your browser. Enter any URL, email address, phone number, or plain text and the QR code updates in real time. Free users get the classic square style. Unlock premium dot and corner styles — rounded, dots, extra-rounded, and more — by watching a short ad. Customize foreground and background colors, adjust the output size, and download as PNG or SVG. Because everything runs locally, the content you encode is never transmitted anywhere.',
    },

    pdfTool: {
      name: 'PDF ↔ Image',
      cardDescription:
        'Convert PDF pages to JPGs, or pack images into a PDF — all in your browser.',
      togglePdfToImg: 'PDF → Images',
      toggleImgToPdf: 'Images → PDF',
      pdfH1: 'PDF to Images',
      imgH1: 'Images to PDF',
      dropPdf: 'Drop a PDF here, or click to upload',
      pdfOnly: 'PDF files only',
      // Use interp(converting, { page, total }) at runtime
      converting: 'Converting page {page} of {total}…',
      conversionFailed: 'Could not process this PDF. The file may be corrupted.',
      passwordProtected: 'This PDF is password-protected.',
      // Use interp(pageCountOne/Many, { n }) based on n === 1
      pageCountOne: '{n} page',
      pageCountMany: '{n} pages',
      downloadAll: 'Download all as ZIP',
      downloadPage: 'Download',
      dropImages: 'Drop images here, or click to upload',
      imagesFormats: 'JPG, PNG, WebP',
      remove: 'Remove',
      moveUp: '↑',
      moveDown: '↓',
      createPdf: 'Create PDF',
      creatingPdf: 'Creating PDF…',
      errorNoImages: 'Add at least one image.',
      seoBody:
        "This dual-mode tool handles PDF-to-image conversion and image-to-PDF creation entirely in your browser. The PDF converter uses Mozilla's pdf.js to rasterize each page at 2× scale, producing sharp JPGs suitable for presentation or archiving. Switch to Images → PDF mode to pack multiple photos into a single PDF — drag images in, reorder them, and download the result. All processing is local: no file ever leaves your machine.",
    },

    imageConverter: {
      name: 'Image Converter',
      cardDescription:
        'Convert images between PNG, JPG, and WebP formats with quality control. Batch convert up to 5 files at once.',
      h1: 'Image Converter',
      dropzone: 'Drop images here, or click to upload',
      dropzoneFormats: 'JPG, PNG, WebP — up to 5 files',
      formatLabel: 'Output format',
      qualityLabel: 'Quality:',
      converting: 'Converting…',
      errorFailed: 'Conversion failed. The file may be corrupted or unsupported.',
      downloadBtn: 'Download',
      downloadAllBtn: 'Download all as ZIP',
      seoBody:
        'This image converter runs entirely in your browser using the Canvas API — no server, no uploads. Drop up to five images at once and select an output format: JPG, PNG, or WebP. For lossy formats like JPG and WebP, a quality slider lets you balance file size against visual fidelity. The conversion is instant: each image is drawn onto a canvas element and exported as a new blob in the target format. Downloading a single converted file triggers a direct save; selecting multiple files packages them automatically into a ZIP archive. Because all processing is local, your images never touch a remote server. This tool is ideal for quickly changing the format of screenshots, photos, or graphics before publishing to a CMS, attaching to an email, or using in a design project. WebP output in particular produces significantly smaller files than JPG or PNG at equivalent visual quality, making it the best choice for web use.',
    },

    imageResizer: {
      name: 'Image Resizer',
      cardDescription:
        'Resize images by exact dimensions or percentage. Lock aspect ratio and download the result instantly.',
      h1: 'Image Resizer',
      dropzone: 'Drop an image here, or click to upload',
      dropzoneFormats: 'JPG, PNG, WebP',
      tabDimensions: 'Dimensions',
      tabPercentage: 'Percentage',
      widthLabel: 'Width (px)',
      heightLabel: 'Height (px)',
      lockAspect: 'Lock aspect ratio',
      percentageLabel: 'Scale:',
      originalLabel: 'Original',
      outputLabel: 'Output',
      formatLabel: 'Output format',
      resizeBtn: 'Resize image',
      downloadBtn: 'Download resized image',
      errorFailed: 'Resize failed. The file may be corrupted or unsupported.',
      seoBody:
        'This image resizer works directly in your browser via the Canvas API — no file is ever transmitted to a server. Upload a JPG, PNG, or WebP image and choose between two resize modes. Dimensions mode lets you enter exact pixel values for width and height; the aspect ratio lock automatically adjusts the opposite dimension so the image never distorts. Percentage mode scales the image uniformly anywhere from 10% to 200% of its original size with a single slider. An output format selector lets you save the result as JPG, PNG, or WebP regardless of the original format. The original and output dimensions are shown side by side as a live preview so you can confirm the result before committing. Resizing is performed on an HTML canvas element and the resulting file is available for download instantly. No data is stored, transmitted, or logged at any point during the process.',
    },

    passwordGenerator: {
      name: 'Password Generator',
      cardDescription:
        'Generate cryptographically secure passwords in your browser. Customize length, character sets, and quantity.',
      h1: 'Password Generator',
      lengthLabel: 'Length:',
      uppercaseLabel: 'Uppercase (A–Z)',
      lowercaseLabel: 'Lowercase (a–z)',
      numbersLabel: 'Numbers (0–9)',
      symbolsLabel: 'Symbols (!@#$%^&*)',
      quantityLabel: 'Quantity:',
      strengthLabel: 'Strength',
      strengthWeak: 'Weak',
      strengthFair: 'Fair',
      strengthStrong: 'Strong',
      strengthVeryStrong: 'Very Strong',
      copyBtn: 'Copy',
      copiedBtn: 'Copied!',
      regenerateBtn: 'Regenerate',
      errorNoCharset: 'Select at least one character type.',
      seoBody:
        'This password generator runs entirely in your browser and uses the Web Crypto API\'s window.crypto.getRandomValues() function — not Math.random() — to ensure cryptographic randomness suitable for security-sensitive applications. Choose a password length from 8 to 64 characters and select which character sets to include: uppercase letters, lowercase letters, numbers, and symbols. Generate up to ten passwords at once for easy comparison and selection. A strength indicator below each password evaluates length and character variety, rating the result as Weak, Fair, Strong, or Very Strong with a color-coded bar. Click the copy button next to any password to send it directly to your clipboard. Nothing is transmitted to a server — the entire generation process runs locally in your browser tab, making this tool safe to use when generating passwords for any account or service.',
    },
  },

  rewardedAd: {
    title: 'Unlock premium style',
    subtitle: 'Watch a short video to unlock all premium styles for this session.',
    adLabel: 'Advertisement',
    // Use interp(countdownLabel, { n }) at runtime
    countdownLabel: 'Skip in {n}s',
    skipNow: 'Use feature',
  },
};

export type Dictionary = typeof en;
