import * as dotenv from "dotenv";
dotenv.config();


import process from 'process';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";


const TRACER_URL = process.env.TRACER_URL || "";
const TRACER_ENV = process.env.TRACER_ENV || "";
const SERVICE_NAME = process.env.SERVICE_NAME || "";

console.log(TRACER_URL, TRACER_ENV, SERVICE_NAME);

const exporterOptions = {
    url: `${TRACER_URL}/v1/traces`
}

const init = () => {

    const traceExporter = new OTLPTraceExporter(exporterOptions);
    const sdk = new opentelemetry.NodeSDK({
        traceExporter,
        instrumentations: [getNodeAutoInstrumentations(), new HttpInstrumentation(),
        new GraphQLInstrumentation({
            // optional params
            allowValues: true,
            // depth: 2,
            // mergeItems: true,
        }),],
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: TRACER_ENV,
        })
    });

    // initialize the SDK and register with the OpenTelemetry API
    // this enables the API to record telemetry

    sdk.start()
        .then(() => console.log('Tracing initialized'))
        .catch((error: any) => console.log('Error initializing tracing', error));

    // gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error: any) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });

}

export { init };
