import { withFetchMock } from './withFetchMock';
import type { Renderer, ProjectAnnotations } from 'storybook/internal/types';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withFetchMock],
};

export default preview;
