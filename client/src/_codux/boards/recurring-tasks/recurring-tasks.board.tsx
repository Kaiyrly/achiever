import { createBoard } from '@wixc3/react-board';
import { PriorityTasks } from '../../../components/PriorityTasks';

export default createBoard({
    name: 'PriorityTasks',
    Board: () => <PriorityTasks key={null} />
});
