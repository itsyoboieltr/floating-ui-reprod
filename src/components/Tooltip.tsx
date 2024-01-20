import { JSX, createSignal, splitProps } from 'solid-js';
import { useFloating, UseFloatingOptions } from 'solid-floating-ui';
import { autoUpdate, flip, offset, shift } from '@floating-ui/dom';
import { Portal } from 'solid-js/web';
import { debounce } from '@solid-primitives/scheduled';
import { cn } from '~/utils';

interface TooltipProps {
  children?: JSX.Element;
  content: JSX.Element;
  options?: UseFloatingOptions<HTMLElement, HTMLElement>;
  class?: {
    style?: string;
    tooltip?: string;
  };
}

const keys = ['children', 'content', 'options', 'class'] as const;

export function Tooltip(
  args: TooltipProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'class'>,
) {
  const [props, rest] = splitProps(args, keys);
  const [showTooltip, setShowTooltip] = createSignal(false);
  const setShowTooltipDebounced = debounce(setShowTooltip, 50);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [reference, setReference] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLElement>();
  const position = useFloating(reference, floating, {
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
    ...props.options,
  });
  return (
    <div
      {...rest}
      ref={setReference}
      onPointerEnter={() => setShowTooltipDebounced(true)}
      onPointerLeave={() => {
        if (showTooltip()) setIsAnimating(true);
        setShowTooltip(false);
        setShowTooltipDebounced.clear();
      }}
      class={cn('w-fit', props.class?.style)}>
      {props.children}
      <Portal mount={showTooltip() || isAnimating() ? undefined : reference()}>
        <div
          style={{
            display: showTooltip() || isAnimating() ? 'block' : 'none',
            top: position.y ? `${position.y}px` : undefined,
            left: position.x ? `${position.x}px` : undefined,
          }}
          class={cn(
            'animate-fade-in pointer-events-none absolute cursor-auto select-none rounded bg-black/60 p-2 text-sm text-white shadow',
            { 'animate-fade-out': isAnimating() },
            props.class?.tooltip,
          )}
          onAnimationEnd={({ animationName }) => {
            if (animationName === 'fade-out') setIsAnimating(false);
          }}
          ref={setFloating}>
          {props.content}
        </div>
      </Portal>
    </div>
  );
}
