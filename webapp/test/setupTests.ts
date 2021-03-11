import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { initTest } from './initTest';
const adapter = new Adapter();
Enzyme.configure({ adapter });
initTest();
