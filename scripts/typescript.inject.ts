import { sampleAsyncTs } from './sample_async_ts.lib.independent';

const log = (message: any) => console.log(message);

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
  log('test');
  log(deps);
};
