import { createBoard } from '@wixc3/react-board';
import { Settings } from '../../../pages/Settings';

export default createBoard({
    name: 'Settings',
    Board: () => <Settings />
});
