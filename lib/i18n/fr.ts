import type { Dictionary } from './en';

export const fr: Dictionary = {
  site: { name: 'QuickTools' },
  nav: { back: '← QuickTools' },
  footer: { copyright: '© 2025 QuickTools' },

  home: {
    badge: 'QuickTools',
    h1line1: 'Des outils en ligne gratuits.',
    h1line2: 'Rapides, privés, gratuits.',
    subheading:
      "Aucun téléchargement. Aucun compte. Tout s'exécute directement dans votre navigateur.",
    openTool: "Ouvrir l'outil →",
    why: {
      heading: 'Pourquoi QuickTools ?',
      features: [
        {
          title: 'Traitement côté client',
          body: "Chaque calcul s'exécute dans votre navigateur. Aucun fichier n'est jamais transmis à un serveur.",
        },
        {
          title: 'Sans compte requis',
          body: "Ouvrez n'importe quel outil et utilisez-le. Sans inscription, sans email, sans friction.",
        },
        {
          title: 'Open source',
          body: 'Le code source complet est sur GitHub. Auditez-le, forkez-le ou contribuez.',
        },
      ],
    },
  },

  privacyBadge: 'Vos fichiers ne quittent jamais votre navigateur',

  tools: {
    imageCompressor: {
      name: "Compresseur d'images",
      cardDescription:
        'Réduisez la taille des fichiers JPG, PNG et WebP avec un curseur de qualité. Comparez les tailles avant/après instantanément.',
      h1: "Compresseur d'images",
      dropzone: 'Déposez une image ici, ou cliquez pour choisir',
      dropzoneFormats: 'JPG, PNG, WebP',
      qualityLabel: 'Qualité :',
      compressing: 'Compression en cours…',
      errorFailed:
        'La compression a échoué. Le fichier est peut-être corrompu ou non supporté.',
      labelOriginal: 'Original',
      labelSaved: 'Économisé',
      labelOutput: 'Résultat',
      downloadBtn: "Télécharger l'image compressée",
      seoBody:
        "Ce compresseur d'images fonctionne entièrement dans votre navigateur grâce à la bibliothèque browser-image-compression. Il prend en charge les formats JPEG, PNG et WebP et conserve la résolution d'origine tout en réduisant la taille du fichier via l'ajustement de la qualité. Un réglage de qualité à 80 % permet généralement une réduction de 40 à 60 % de la taille du fichier sans dégradation visible. Le fichier compressé est généré localement — rien n'est téléchargé ni stocké à distance.",
    },

    qrCode: {
      name: 'Générateur de QR code',
      cardDescription:
        "Transformez n'importe quelle URL ou texte en QR code scannable. Personnalisez le style et les couleurs, téléchargez en PNG.",
      h1: 'Générateur de QR code',
      inputLabel: 'URL ou texte',
      inputPlaceholder: 'https://exemple.com',
      sizeLabel: 'Taille :',
      foregroundLabel: 'Premier plan',
      backgroundLabel: 'Arrière-plan',
      dotStyleLabel: 'Style des points',
      cornerStyleLabel: 'Style des coins',
      errorLevelLabel: "Correction d'erreur",
      downloadPng: 'Télécharger PNG',
      downloadSvg: 'Télécharger SVG',
      freeTag: 'Gratuit',
      premiumTag: 'Premium',
      watchToUnlock: 'Regardez 30s pour débloquer',
      styleSquare: 'Carré',
      styleRounded: 'Arrondi',
      styleDots: 'Points',
      styleClassy: 'Élégant',
      styleClassyRounded: 'Élégant arrondi',
      styleExtraRounded: 'Très arrondi',
      cornerSquare: 'Carré',
      cornerExtraRounded: 'Arrondi',
      cornerDot: 'Point',
      seoBody:
        "Ce générateur de QR code crée des codes scannables directement dans votre navigateur. Saisissez n'importe quelle URL, adresse e-mail, numéro de téléphone ou texte libre et le QR code se met à jour en temps réel. Les utilisateurs gratuits disposent du style carré classique. Débloquez les styles premium en regardant une courte publicité. Personnalisez les couleurs, ajustez la taille et téléchargez en PNG ou SVG. Tout fonctionne localement, vos données ne quittent jamais votre appareil.",
    },

    pdfTool: {
      name: 'PDF ↔ Image',
      cardDescription:
        'Convertissez des pages PDF en images JPG, ou assemblez des images en PDF — le tout dans votre navigateur.',
      togglePdfToImg: 'PDF → Images',
      toggleImgToPdf: 'Images → PDF',
      pdfH1: 'PDF vers images',
      imgH1: 'Images vers PDF',
      dropPdf: 'Déposez un PDF ici, ou cliquez pour choisir',
      pdfOnly: 'Fichiers PDF uniquement',
      converting: 'Conversion de la page {page} sur {total}…',
      conversionFailed: 'Impossible de traiter ce PDF. Le fichier est peut-être corrompu.',
      passwordProtected: 'Ce PDF est protégé par mot de passe.',
      pageCountOne: '{n} page',
      pageCountMany: '{n} pages',
      downloadAll: 'Tout télécharger en ZIP',
      downloadPage: 'Télécharger',
      dropImages: 'Déposez des images ici, ou cliquez pour choisir',
      imagesFormats: 'JPG, PNG, WebP',
      remove: 'Supprimer',
      moveUp: '↑',
      moveDown: '↓',
      createPdf: 'Créer le PDF',
      creatingPdf: 'Création du PDF…',
      errorNoImages: 'Ajoutez au moins une image.',
      seoBody:
        "Cet outil double mode gère la conversion PDF vers image et la création de PDF à partir d'images, entièrement dans votre navigateur. Le convertisseur PDF utilise pdf.js de Mozilla pour rastériser chaque page à 2× de résolution, produisant des JPG nets adaptés à la présentation ou à l'archivage. Passez en mode Images → PDF pour regrouper plusieurs photos dans un seul fichier PDF. Tout le traitement est local : aucun fichier ne quitte votre appareil.",
    },
  },

  rewardedAd: {
    title: 'Débloquer le style premium',
    subtitle:
      'Regardez une courte vidéo pour débloquer tous les styles premium pour cette session.',
    adLabel: 'Publicité',
    countdownLabel: 'Passer dans {n}s',
    skipNow: 'Utiliser la fonctionnalité',
  },
};
