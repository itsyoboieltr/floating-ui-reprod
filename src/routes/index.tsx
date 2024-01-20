import { Show } from 'solid-js';
import { Tooltip } from '~/components/Tooltip';

export default function Home() {
  return (
    <div class={'mx-auto p-4 text-center text-gray-700'}>
      <pre class='mb-20'>Floating UI bug reprod</pre>
      <div class='flex justify-center'>
        <Show
          when={
            <div>
              <Tooltip content={'Test tooltip'}>
                <button>Hover here</button>
              </Tooltip>
            </div>
          }>
          <div>
            <Tooltip content={'Test tooltip'}>
              <button>Hover here</button>
            </Tooltip>
          </div>
        </Show>
      </div>
    </div>
  );
}
