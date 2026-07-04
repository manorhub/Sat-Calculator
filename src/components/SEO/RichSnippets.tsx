import React from 'react';
import { CalculatorConfig } from '../../types/calculator';

interface RichSnippetsProps {
  config: CalculatorConfig;
  url: string;
}

export default function RichSnippets({ config, url }: RichSnippetsProps) {
  // WebApplication / SoftwareApplication (Calculator) Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#webapp`,
    url: url,
    name: config.title,
    applicationCategory: 'FinancialApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: config.seo.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'MXN',
    },
  };

  // FAQ Page Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: config.content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Breadcrumb List Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: typeof window !== 'undefined' ? window.location.origin : 'https://calculadorasat.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.category,
        item: `${typeof window !== 'undefined' ? window.location.origin : 'https://calculadorasat.org'}/${config.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
