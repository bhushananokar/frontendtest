import { MeditationApp } from '@/components/MeditationApp';
import { MeditationErrorBoundary } from '@/components/MeditationErrorBoundary';

const Meditation = () => {
  return (
    <MeditationErrorBoundary>
      <MeditationApp />
    </MeditationErrorBoundary>
  );
};

export default Meditation;