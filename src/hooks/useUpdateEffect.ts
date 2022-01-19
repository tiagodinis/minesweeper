/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useLayoutEffect } from "react";

function useOnUpdateEffect(effect: () => void) {
  const isFirst = useRef(true);

  function onUpdateEffect() {
    if (isFirst.current) isFirst.current = false;
    else effect();
  }

  return onUpdateEffect;
}

export const useUpdateEffect = (effect: () => void, deps: any[]) =>
  useEffect(useOnUpdateEffect(effect), deps);

export const useUpdateLayoutEffect = (effect: () => void, deps: any[]) =>
  useLayoutEffect(useOnUpdateEffect(effect), deps);
