import { sampleAsyncTs } from './sample_async_ts.lib.independent';

/**
 * @match http://example.com/
 *
 * @entrypoint script
 * @include sample_async_ts
 */
export const script = (
  deps: {
    sample_async_ts: ReturnType<typeof sampleAsyncTs>
  },
) => {
  console.log('test');
  console.log(deps);
};
