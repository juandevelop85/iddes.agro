import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking,
} from 'reactotron-react-native';

import {reactotronRedux} from 'reactotron-redux';

const reactotron = Reactotron.configure({
  name: 'Iddesagro',
  host: 'localhost',
})
  .use(trackGlobalErrors())
  .use(openInEditor())
  .use(overlay())
  .use(asyncStorage())
  .use(networking())
  .use(reactotronRedux())
  .connect();

export default reactotron;
