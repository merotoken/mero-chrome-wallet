import PageIndex from './pages/Index';
import Agreement from './pages/Agreement';
import Create from './pages/Create';
import Receive from './pages/Receive';
import Send from './pages/Send';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import ExportSeedPhrase from './pages/settings/ExportSeedPhrase';
import ExportPrivateKey from './pages/settings/ExportPrivateKey';
import Unlock from './pages/Unlock';

export default [
  {
    path: '/',
    name: 'Wallet',
    component: PageIndex,
    props: true
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: Agreement,
    props: true
  },
  {
  	path: '/create',
    name: 'Create',
  	component: Create,
  	props: true
  },
  {
  	path: '/recieve',
    name: 'Receive',
  	component: Receive,
  	props: true
  },
  {
  	path: '/send',
    name: 'Send',
  	component: Send,
  	props: true
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    props: true
  },
  {
  	path: '/settings',
    name: 'Settings',
  	component: Settings,
  	props: true
  },
  {
  	path: '/privatekey',
    name: 'ExportPrivateKey',
  	component: ExportPrivateKey,
  	props: true
  },
  {
  	path: '/seedphrase',
    name: 'ExportSeedPhrase',
  	component: ExportSeedPhrase,
  	props: true
  },
  {
    path: '/unlock',
    name: 'Unlock',
    component: Unlock,
    props: true
  },
  {
  	path: '*',
  	redirect: '/'
  }
]
