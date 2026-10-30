"use client";

import { useSyncExternalStore } from 'react';

// A shared clock. Returns null during server render and hydration, then the
// current time (rounded to `stepMs`) on the client. Using null on the server keeps
// statically generated HTML identical for everyone, so there are no hydration mismatches
// when campaign prices switch on at a given date.

const listeners = new Set();
let timer = null;

function subscribe(callback) {
  listeners.add(callback);
  if (!timer) {
    timer = setInterval(() => listeners.forEach((l) => l()), 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(stepMs = 60000) {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / stepMs) * stepMs,
    () => null
  );
}
