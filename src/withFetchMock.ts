import fetchMock from 'fetch-mock';
import { MockCall } from 'fetch-mock/types';
import { makeDecorator } from '@storybook/addons';
import { PARAM_KEY } from './constants';
import { Mock, MockArray, MockObject } from './typings';

/**
 * Helper function to add an array of mocks to fetch-mock.
 *
 * @param {Mock[]} mocks A list of mocks to add.
 */
function addMocks(mocks: Mock[]) {
  if (Array.isArray(mocks)) {
    mocks.forEach((mock) => {
      // Mock defined as: [ matcher, response, options ]
      if (Array.isArray(mock)) {
        fetchMock.mock(...(mock as MockArray));
        return;
      }

      const { matcher, response, options } = mock as MockObject;

      // Mock defined as: { matcher, [response], [options] }
      if (matcher) {
        fetchMock.mock(matcher, response, options);
      }
    });
  } else {
    console.warn(`fetchMock.mocks should be an array; ${typeof mocks} given.`);
  }
}

export const withFetchMock = makeDecorator({
  name: 'withFetchMock',
  parameterName: PARAM_KEY,
  // TODO: If a story doesn't have any fetchMock parameters, we still need to
  //   reset fetch-mock.
  skipIfNoParametersOrOptions: false,

  wrapper(storyFn, context, { parameters }) {
    // Remove any mocks from fetch-mock that may have been defined by other
    // stories.
    fetchMock.reset();

    // By default, allow any fetch call not mocked to use the actual network.
    fetchMock.config.fallbackToNetwork = true;

    // Add all the mocks.
    addMocks(parameters.mocks);

    // Render the story.
    return storyFn(context);
  },
});
