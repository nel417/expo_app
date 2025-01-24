import { ActiveComponent } from '@/app/(tabs)';
import { atom } from 'jotai';

export const activeComponentAtom = atom<ActiveComponent>('none'); 