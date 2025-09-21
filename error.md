Error in transcribeAudio: Error: Unexpected STT response format
    at STTService.transcribeAudio (sttService.ts:182:15)
    at async STTService.stopRecordingAndTranscribe (sttService.ts:221:29)
    at async TherapyIntegrationService.stopListeningAndProcess (therapyIntegrationService.ts:167:27)
    at async handleMicrophoneClick (Therapy.tsx:157:9)
transcribeAudio @ sttService.ts:186
await in transcribeAudio
stopRecordingAndTranscribe @ sttService.ts:221
await in stopRecordingAndTranscribe
stopListeningAndProcess @ therapyIntegrationService.ts:167
handleMicrophoneClick @ Therapy.tsx:157
callCallback2 @ chunk-SVG7M4VJ.js?v=0771542f:3678
invokeGuardedCallbackDev @ chunk-SVG7M4VJ.js?v=0771542f:3703
invokeGuardedCallback @ chunk-SVG7M4VJ.js?v=0771542f:3737
invokeGuardedCallbackAndCatchFirstError @ chunk-SVG7M4VJ.js?v=0771542f:3740
executeDispatch @ chunk-SVG7M4VJ.js?v=0771542f:7044
processDispatchQueueItemsInOrder @ chunk-SVG7M4VJ.js?v=0771542f:7064
processDispatchQueue @ chunk-SVG7M4VJ.js?v=0771542f:7073
dispatchEventsForPlugins @ chunk-SVG7M4VJ.js?v=0771542f:7081
(anonymous) @ chunk-SVG7M4VJ.js?v=0771542f:7204
batchedUpdates$1 @ chunk-SVG7M4VJ.js?v=0771542f:18964
batchedUpdates @ chunk-SVG7M4VJ.js?v=0771542f:3583
dispatchEventForPluginEventSystem @ chunk-SVG7M4VJ.js?v=0771542f:7203
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-SVG7M4VJ.js?v=0771542f:5482
dispatchEvent @ chunk-SVG7M4VJ.js?v=0771542f:5476
dispatchDiscreteEvent @ chunk-SVG7M4VJ.js?v=0771542f:5453
therapyIntegrationService.ts:184 Error processing user speech: Error: Unexpected STT response format
    at TherapyIntegrationService.stopListeningAndProcess (therapyIntegrationService.ts:170:15)
    at async handleMicrophoneClick (Therapy.tsx:157:9)
stopListeningAndProcess @ therapyIntegrationService.ts:184
await in stopListeningAndProcess
handleMicrophoneClick @ Therapy.tsx:157
callCallback2 @ chunk-SVG7M4VJ.js?v=0771542f:3678
invokeGuardedCallbackDev @ chunk-SVG7M4VJ.js?v=0771542f:3703
invokeGuardedCallback @ chunk-SVG7M4VJ.js?v=0771542f:3737
invokeGuardedCallbackAndCatchFirstError @ chunk-SVG7M4VJ.js?v=0771542f:3740
executeDispatch @ chunk-SVG7M4VJ.js?v=0771542f:7044
processDispatchQueueItemsInOrder @ chunk-SVG7M4VJ.js?v=0771542f:7064
processDispatchQueue @ chunk-SVG7M4VJ.js?v=0771542f:7073
dispatchEventsForPlugins @ chunk-SVG7M4VJ.js?v=0771542f:7081
(anonymous) @ chunk-SVG7M4VJ.js?v=0771542f:7204
batchedUpdates$1 @ chunk-SVG7M4VJ.js?v=0771542f:18964
batchedUpdates @ chunk-SVG7M4VJ.js?v=0771542f:3583
dispatchEventForPluginEventSystem @ chunk-SVG7M4VJ.js?v=0771542f:7203
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-SVG7M4VJ.js?v=0771542f:5482
dispatchEvent @ chunk-SVG7M4VJ.js?v=0771542f:5476
dispatchDiscreteEvent @ chunk-SVG7M4VJ.js?v=0771542f:5453
therapyIntegrationService.ts:332 Therapy flow error: Unexpected STT response format