// Test file to verify the therapy integration services
import { 
  sttService, 
  therapistService, 
  ttsService, 
  therapyIntegrationService 
} from '../services';

// Simple test function to check service initialization
export async function testTherapyServices() {
  console.log('🧪 Testing Therapy Services...');
  
  try {
    // Test 1: Check if services are defined
    console.log('✅ Services imported successfully');
    console.log('- STT Service:', typeof sttService);
    console.log('- Therapist Service:', typeof therapistService);
    console.log('- TTS Service:', typeof ttsService);
    console.log('- Integration Service:', typeof therapyIntegrationService);

    // Test 2: Check therapist service health
    console.log('\n🔍 Testing Therapist Service Health...');
    const therapistHealth = await therapistService.healthCheck();
    console.log('Therapist API Health:', therapistHealth ? '✅' : '❌');

    // Test 3: Check TTS connection capability
    console.log('\n🔍 Testing TTS Service Connection...');
    try {
      await ttsService.connect();
      console.log('TTS WebSocket Connection:', ttsService.isConnectedToTTS() ? '✅' : '❌');
      ttsService.disconnect();
    } catch (error) {
      console.log('TTS WebSocket Connection: ❌', error);
    }

    // Test 4: Check STT service methods
    console.log('\n🔍 Testing STT Service Methods...');
    console.log('STT Recording Status:', sttService.isRecording() ? 'Recording' : 'Ready');

    // Test 5: Check integration service
    console.log('\n🔍 Testing Integration Service...');
    const integrationHealth = await therapyIntegrationService.healthCheck();
    console.log('Integration Health Check:', integrationHealth);

    console.log('\n🎉 All service tests completed!');
    return true;

  } catch (error) {
    console.error('❌ Service test failed:', error);
    return false;
  }
}

// Export test function for use in development
if (typeof window !== 'undefined') {
  (window as any).testTherapyServices = testTherapyServices;
}