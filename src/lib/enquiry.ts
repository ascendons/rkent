"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "./site";

/** Items the visitor has picked from the catalogue, shared between the catalogue and the enquiry form. */
let items: Product[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const enquiry = {
  toggle(p: Product) {
    items = items.some((i) => i.artNo === p.artNo) ? items.filter((i) => i.artNo !== p.artNo) : [...items, p];
    emit();
  },
  remove(artNo: string) {
    items = items.filter((i) => i.artNo !== artNo);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const empty: Product[] = [];

export const useEnquiry = () => useSyncExternalStore(subscribe, () => items, () => empty);
