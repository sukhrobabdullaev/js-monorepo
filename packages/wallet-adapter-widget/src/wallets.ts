import hereIcon from './icons/here.js';
import nearIcon from './icons/near.js';
import meteorIcon from './icons/meteor.js';
import { createHereAdapter } from './adapters/here.js';
import { createNearAdapter } from './adapters/near.js';
import { createMeteorAdapter } from './adapters/meteor.js';

// note: id used as key for browser to remember previous selection
export const wallets = [
  {
    id: 'myNearWallet',
    name: 'MyNearWallet',
    icon: nearIcon,
    adapter: createNearAdapter()
  },
  {
    id: 'here',
    name: 'HERE Wallet',
    icon: hereIcon,
    adapter: createHereAdapter()
  },
  {
    id: 'meteor',
    name: 'Meteor Wallet',
    icon: meteorIcon,
    adapter: createMeteorAdapter()
  }
];
