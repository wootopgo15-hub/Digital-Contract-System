@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard', ui-sans-serif, system-ui, sans-serif;
}

@layer utilities {
  .touch-none {
    touch-action: none;
  }
}

@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    background-color: white !important;
  }
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
  .print-page {
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}

.print-only {
  display: none;
}

