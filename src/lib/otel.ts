import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

const OTLP_ENDPOINT = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT;

function getExporterUrl(): string {
  if (!OTLP_ENDPOINT) return '';
  // If relative path, resolve against current origin (uses Vite proxy in dev)
  if (OTLP_ENDPOINT.startsWith('/')) {
    return `${window.location.origin}${OTLP_ENDPOINT}`;
  }
  return OTLP_ENDPOINT;
}

export function initOtel(): void {
  // Only run in local development
  if (import.meta.env.PROD) return;

  const exporterUrl = getExporterUrl();
  if (!exporterUrl) return;

  const provider = new WebTracerProvider({
    resource: new Resource({
      'service.name': 'icaa-world-frontend',
    }),
  });

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: exporterUrl,
      }),
    ),
  );

  provider.register({
    propagator: new W3CTraceContextPropagator(),
  });

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-xml-http-request': {
          propagateTraceHeaderCorsUrls: [/.*/],
        },
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: [/.*/],
        },
      }),
    ],
  });
}
